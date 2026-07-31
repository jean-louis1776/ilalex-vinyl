<?php

namespace App\Console\Commands;

use App\Models\Vinyl;
use Illuminate\Console\Command;

/**
 * Заливает описания пластинок из database/seeders/data/descriptions-*.json.
 * Формат файла: {"<id пластинки>": "<текст описания>"}.
 *
 * По умолчанию уже заполненные описания не трогает — чтобы правки, сделанные
 * руками в админке, не затирались при повторном запуске.
 */
class ImportDescriptions extends Command
{
    protected $signature = 'app:import-descriptions
        {--overwrite : Перезаписывать описания, заполненные вручную}';

    protected $description = 'Импортировать описания пластинок из JSON-файлов';

    public function handle(): int
    {
        $files = glob(database_path('seeders/data/descriptions-*.json'));

        if (! $files) {
            $this->error('Файлы descriptions-*.json не найдены.');

            return self::FAILURE;
        }

        $descriptions = [];
        foreach ($files as $file) {
            $descriptions += json_decode(file_get_contents($file), true, flags: JSON_THROW_ON_ERROR);
        }

        $updated = 0;
        $skipped = 0;
        $missing = 0;

        foreach ($descriptions as $id => $text) {
            $vinyl = Vinyl::find((int) $id);

            if (! $vinyl) {
                $missing++;

                continue;
            }

            if (filled($vinyl->description) && ! $this->option('overwrite')) {
                $skipped++;

                continue;
            }

            // saveQuietly: описание не меняет состояние покупки, лишние
            // события модели здесь ни к чему
            $vinyl->description = $text;
            $vinyl->saveQuietly();
            $updated++;
        }

        $this->info("Записано описаний: {$updated}.");

        if ($skipped) {
            $this->line("Пропущено уже заполненных: {$skipped} (--overwrite перезапишет).");
        }

        if ($missing) {
            $this->warn("В базе не нашлось пластинок с id из файла: {$missing}.");
        }

        return self::SUCCESS;
    }
}
