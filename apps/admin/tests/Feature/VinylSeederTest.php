<?php

namespace Tests\Feature;

use App\Models\Vinyl;
use Database\Seeders\VinylSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Сидер запускается при каждом деплое, поэтому важно, что он не трогает
 * существующие строки: в базе живут отметки «куплено», актуальные цены
 * и правки из админки.
 */
class VinylSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_does_not_touch_existing_records(): void
    {
        $items = json_decode(file_get_contents(database_path('seeders/data/vinyls.json')), true);
        $first = $items[0];

        // Пластинка уже в базе: куплена, цена изменилась, описание заполнено
        Vinyl::create([
            'id' => $first['id'],
            'artist' => $first['artist'],
            'name' => $first['name'],
            'price' => 9999,
            'link' => $first['link'],
            'image' => $first['image'],
            'purchased' => true,
            'description' => 'Написано руками в админке',
            'sold_out' => true,
        ]);

        (new VinylSeeder)->run();

        $vinyl = Vinyl::find($first['id']);

        $this->assertTrue($vinyl->purchased, 'Отметка «куплено» должна пережить сид');
        $this->assertSame(9999, $vinyl->price, 'Актуальная цена не должна откатываться к JSON');
        $this->assertSame('Написано руками в админке', $vinyl->description);
        $this->assertTrue($vinyl->sold_out);
    }

    public function test_adds_missing_records(): void
    {
        $items = json_decode(file_get_contents(database_path('seeders/data/vinyls.json')), true);

        (new VinylSeeder)->run();

        $this->assertSame(count($items), Vinyl::count());

        // Повторный запуск не плодит дубликаты
        (new VinylSeeder)->run();

        $this->assertSame(count($items), Vinyl::count());
    }
}
