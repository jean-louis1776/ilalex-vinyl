<?php

namespace Database\Seeders;

use App\Models\Vinyl;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Первичная заливка каталога из data/vinyls.json — это тот самый список,
 * который раньше лежал в apps/web/app/data/vinyl-list.ts. Сидер идемпотентен:
 * повторный запуск обновляет строки по id и не плодит дубликаты.
 */
class VinylSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/data/vinyls.json');

        if (! is_file($path)) {
            $this->command?->warn("Файл {$path} не найден — каталог не залит.");

            return;
        }

        $items = json_decode(file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);

        foreach ($items as $index => $item) {
            Vinyl::updateOrCreate(
                ['id' => $item['id']],
                [
                    'artist' => $item['artist'],
                    'name' => $item['name'],
                    'price' => (int) ($item['price'] ?? 0),
                    'link' => $item['link'] ?? '',
                    'image' => $item['image'] ?? '',
                    'original_year' => $item['original'] ?? null,
                    'repress_year' => $item['repress'] ?? null,
                    'important' => (bool) ($item['important'] ?? false),
                    'sealed' => (bool) ($item['sealed'] ?? false),
                    'purchased' => (bool) ($item['purchased'] ?? false),
                    'is_published' => true,
                    'sort_order' => $index,
                ],
            );
        }

        // id проставлялись вручную — двигаем последовательность, иначе первая
        // же пластинка, созданная в админке, упрётся в конфликт первичного ключа
        $max = (int) Vinyl::max('id');
        DB::statement("SELECT setval(pg_get_serial_sequence('vinyls', 'id'), ?, true)", [max($max, 1)]);

        $this->command?->info('Каталог: '.count($items).' пластинок.');
    }
}
