<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vinyl;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Страницы ресурса рендерятся целиком — значит ошибки в схеме формы,
 * колонках таблицы и предпросмотре обложки всплывут здесь, а не в браузере.
 */
class VinylResourceTest extends TestCase
{
    use RefreshDatabase;

    private function vinyl(array $attributes = []): Vinyl
    {
        return Vinyl::create(array_merge([
            'artist' => 'Peggy Lee',
            'name' => 'The Man I Love (UK), 1984',
            'price' => 2431,
            'link' => 'https://vinylpark.ru/catalog/peggy_lee/',
            'image' => 'https://vinylpark.ru/upload/iblock/88c/cover.jpg',
            'original_year' => 1984,
            'important' => true,
        ], $attributes));
    }

    public function test_list_page_renders_with_records(): void
    {
        $this->vinyl();

        $this->actingAs(User::factory()->create())
            ->get('/vinyls')
            ->assertOk()
            ->assertSee('Peggy Lee');
    }

    public function test_create_page_renders(): void
    {
        $this->actingAs(User::factory()->create())
            ->get('/vinyls/create')
            ->assertOk()
            // Поле пустое, поэтому предпросмотра ещё нет — только подсказка
            ->assertSee('Обложка', escape: false)
            ->assertDontSee('images.weserv.nl');
    }

    /** У заполненной пластинки предпросмотр обложки уже отрисован. */
    public function test_edit_page_renders_the_cover_preview(): void
    {
        $vinyl = $this->vinyl();

        $this->actingAs(User::factory()->create())
            ->get("/vinyls/{$vinyl->id}/edit")
            ->assertOk()
            ->assertSee('Предпросмотр обложки', escape: false)
            ->assertSee('images.weserv.nl');
    }

    /** Черновики видны в админке, но в публичный API не уходят. */
    public function test_unpublished_vinyl_stays_in_the_admin(): void
    {
        $draft = $this->vinyl(['name' => 'Черновик', 'is_published' => false]);

        $this->assertFalse($draft->fresh()->is_published);

        $this->actingAs(User::factory()->create())
            ->get('/vinyls')
            ->assertOk()
            ->assertSee('Черновик');
    }
}
