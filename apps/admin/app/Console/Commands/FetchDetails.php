<?php

namespace App\Console\Commands;

use App\Models\Vinyl;
use App\Support\StoreDetails;
use Illuminate\Console\Command;

/**
 * Массово заполняет характеристики издания со страниц магазина.
 * Сам разбор страницы живёт в App\Support\StoreDetails — им же пользуется
 * кнопка «Подтянуть с сайта магазина» в форме админки.
 *
 * Уже заполненные поля по умолчанию не трогаются, чтобы правки из админки
 * не затирались при повторном запуске.
 */
class FetchDetails extends Command
{
    protected $signature = 'app:fetch-details
        {--overwrite : Перезаписывать поля, заполненные ранее}
        {--id=* : Обработать только указанные id}
        {--delay=1500 : Пауза между запросами в миллисекундах}';

    protected $description = 'Заполнить жанр, страну, лейбл и состояние со страниц магазина';

    public function handle(StoreDetails $store): int
    {
        $query = Vinyl::query()->orderBy('id');

        if ($ids = $this->option('id')) {
            $query->whereIn('id', $ids);
        } elseif (! $this->option('overwrite')) {
            // Берём только те, где чего-то не хватает
            $query->where(function ($q) {
                $q->whereNull('genre')->orWhereNull('country')
                    ->orWhereNull('label')->orWhereNull('condition');
            });
        }

        $vinyls = $query->get();

        if ($vinyls->isEmpty()) {
            $this->info('Заполнять нечего — все характеристики на месте.');

            return self::SUCCESS;
        }

        $delay = max(0, (int) $this->option('delay')) * 1000;
        $filled = 0;
        $failed = [];

        $bar = $this->output->createProgressBar($vinyls->count());
        $bar->start();

        foreach ($vinyls as $vinyl) {
            $details = $store->fetch($vinyl->link);

            if ($details === null) {
                $failed[] = "{$vinyl->id} — {$vinyl->artist} — {$vinyl->name}";
            } else {
                $this->apply($vinyl, $details);
                $filled++;
            }

            $bar->advance();
            // Пауза между запросами: 170 страниц подряд без неё — уже нагрузка
            usleep($delay);
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("Заполнено: {$filled} из {$vinyls->count()}.");

        if ($failed) {
            $this->warn('Не удалось разобрать ('.count($failed).'):');
            foreach ($failed as $line) {
                $this->line('  '.$line);
            }
        }

        return self::SUCCESS;
    }

    private function apply(Vinyl $vinyl, array $details): void
    {
        $overwrite = $this->option('overwrite');

        foreach ($details as $field => $value) {
            if ($value === null) {
                continue;
            }
            if ($overwrite || blank($vinyl->{$field})) {
                $vinyl->{$field} = $value;
            }
        }

        $vinyl->save();
    }
}
