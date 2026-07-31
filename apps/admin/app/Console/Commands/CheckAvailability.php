<?php

namespace App\Console\Commands;

use App\Models\Vinyl;
use App\Support\StoreDetails;
use Illuminate\Console\Command;

/**
 * Сверяет с магазином то, что меняется со временем: выкуплен ли лот и
 * сколько он стоит сейчас. В отличие от app:fetch-details (жанр, лейбл,
 * страна — они у издания не меняются), эту команду имеет смысл гонять
 * регулярно.
 *
 * Купленные пластинки по умолчанию пропускаются: их судьба в магазине
 * владельцу уже безразлична, а лишние запросы ни к чему.
 */
class CheckAvailability extends Command
{
    protected $signature = 'app:check-availability
        {--id=* : Проверить только указанные id}
        {--with-purchased : Проверять и уже купленные пластинки}
        {--keep-price : Не трогать цену, обновлять только наличие}
        {--delay=1200 : Пауза между запросами в миллисекундах}';

    protected $description = 'Проверить наличие лотов и актуальные цены в магазине';

    public function handle(StoreDetails $store): int
    {
        $query = Vinyl::query()->orderBy('id');

        if ($ids = $this->option('id')) {
            $query->whereIn('id', $ids);
        } elseif (! $this->option('with-purchased')) {
            $query->where('purchased', false);
        }

        $vinyls = $query->get();

        if ($vinyls->isEmpty()) {
            $this->info('Проверять нечего.');

            return self::SUCCESS;
        }

        $delay = max(0, (int) $this->option('delay')) * 1000;
        $keepPrice = $this->option('keep-price');

        $soldOut = [];
        $priceChanged = [];
        $failed = 0;

        $bar = $this->output->createProgressBar($vinyls->count());
        $bar->start();

        foreach ($vinyls as $vinyl) {
            $state = $store->fetchAvailability($vinyl->link);

            if ($state === null) {
                $failed++;
                $bar->advance();
                usleep($delay);

                continue;
            }

            $changed = $vinyl->applyAvailability($state, withPrice: ! $keepPrice);

            if ($changed['became_sold_out']) {
                $soldOut[] = "{$vinyl->artist} — {$vinyl->name}";
            }

            if ($changed['old_price'] !== null) {
                $priceChanged[] = "{$vinyl->artist} — {$vinyl->name}: {$changed['old_price']} → {$vinyl->price} ₽";
            }

            $bar->advance();
            // Пауза между запросами: сотни страниц подряд — уже нагрузка
            usleep($delay);
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("Проверено: {$vinyls->count()}, не удалось прочитать: {$failed}.");

        if ($soldOut) {
            $this->warn('Выкупили ('.count($soldOut).'):');
            foreach ($soldOut as $line) {
                $this->line('  '.$line);
            }
        }

        if ($priceChanged) {
            $this->info('Изменились цены ('.count($priceChanged).'):');
            foreach ($priceChanged as $line) {
                $this->line('  '.$line);
            }
        }

        if (! $soldOut && ! $priceChanged) {
            $this->line('Изменений нет.');
        }

        return self::SUCCESS;
    }
}
