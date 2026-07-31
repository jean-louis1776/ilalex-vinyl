<?php

namespace Tests\Feature;

use App\Models\Vinyl;
use App\Support\CoverImage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VinylTest extends TestCase
{
    use RefreshDatabase;

    private function makeVinyl(array $attributes = []): Vinyl
    {
        return Vinyl::create(array_merge([
            'artist' => 'Peggy Lee',
            'name' => 'The Man I Love (UK), 1984',
            'price' => 2431,
            'link' => 'https://vinylpark.ru/catalog/peggy_lee/',
            'image' => 'https://vinylpark.ru/upload/iblock/88c/cover.jpg',
        ], $attributes));
    }

    public function test_purchase_toggle_stamps_and_clears_the_date(): void
    {
        $vinyl = $this->makeVinyl();
        $this->assertNull($vinyl->purchased_at);

        $vinyl->update(['purchased' => true]);
        $this->assertNotNull($vinyl->fresh()->purchased_at);

        $vinyl->update(['purchased' => false]);
        $this->assertNull($vinyl->fresh()->purchased_at);
    }

    public function test_cover_preview_goes_through_the_proxy(): void
    {
        $url = CoverImage::proxy('https://vinylpark.ru/upload/cover.jpg');

        $this->assertStringStartsWith('https://images.weserv.nl/?url=', $url);
        $this->assertStringContainsString('ssl%3Avinylpark.ru%2Fupload%2Fcover.jpg', $url);
    }

    /** В src нельзя пускать javascript:/data: — иначе это XSS. */
    public function test_cover_preview_rejects_non_http_urls(): void
    {
        $this->assertNull(CoverImage::proxy('javascript:alert(1)'));
        $this->assertNull(CoverImage::proxy('data:image/svg+xml,<svg onload=alert(1)>'));
        $this->assertNull(CoverImage::proxy(''));
        $this->assertNull(CoverImage::proxy(null));
    }

    /** Поля «Порядок» в форме нет — новая пластинка сама встаёт в конец. */
    public function test_sort_order_is_assigned_automatically(): void
    {
        $first = $this->makeVinyl();
        $second = $this->makeVinyl(['name' => 'Второй']);

        $this->assertSame($first->sort_order + 1, $second->sort_order);
    }

    /** Явно заданный порядок (например, из сидера) не перетирается. */
    public function test_explicit_sort_order_is_kept(): void
    {
        $this->assertSame(0, $this->makeVinyl(['sort_order' => 0])->sort_order);
        $this->assertSame(42, $this->makeVinyl(['name' => 'Другой', 'sort_order' => 42])->sort_order);
    }

    public function test_year_falls_back_from_original_to_repress(): void
    {
        $this->assertSame(1984, $this->makeVinyl(['original_year' => 1984, 'repress_year' => 2015])->year);
        $this->assertSame(2015, $this->makeVinyl(['repress_year' => 2015])->year);
        $this->assertNull($this->makeVinyl()->year);
    }
}
