<?php

namespace Database\Seeders;

use App\Models\Vinyl;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Заливка каталога из data/vinyls.json — это тот самый список, который раньше
 * лежал в apps/web/app/data/vinyl-list.ts.
 *
 * Сидер только ДОБАВЛЯЕТ недостающие пластинки и никогда не трогает уже
 * существующие. Это принципиально: он запускается при каждом деплое, а в базе
 * к тому моменту живут отметки «куплено», актуальные цены и правки из
 * админки — обновление по JSON их бы затёрло. После первой заливки источник
 * правды по существующим строкам — админка, а не файл.
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

        $added = 0;

        foreach ($items as $index => $item) {
            if (Vinyl::whereKey($item['id'])->exists()) {
                continue;
            }

            $added++;

            Vinyl::create(
                [
                    'id' => $item['id'],
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
        // же пластинка, созданная в админке, упрётся в конфликт первичного
        // ключа. Только для Postgres: в sqlite (тесты) счётчик свой.
        if (DB::connection()->getDriverName() === 'pgsql') {
            $max = (int) Vinyl::max('id');
            DB::statement("SELECT setval(pg_get_serial_sequence('vinyls', 'id'), ?, true)", [max($max, 1)]);
        }

        $this->command?->info('Каталог: '.count($items).' пластинок.');
    }
}
