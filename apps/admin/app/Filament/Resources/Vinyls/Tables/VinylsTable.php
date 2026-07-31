<?php

namespace App\Filament\Resources\Vinyls\Tables;

use App\Support\CoverImage;
use App\Support\StoreDetails;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Collection;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class VinylsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->columns([
                ImageColumn::make('image')
                    ->label('Обложка')
                    ->getStateUsing(fn ($record) => CoverImage::proxy($record->image, 120))
                    ->size(56),
                TextColumn::make('artist')
                    ->label('Исполнитель')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('name')
                    ->label('Альбом')
                    ->searchable()
                    ->wrap()
                    ->limit(60),
                TextColumn::make('price')
                    ->label('Цена')
                    ->numeric(thousandsSeparator: ' ')
                    ->suffix(' ₽')
                    ->sortable()
                    ->summarize(\Filament\Tables\Columns\Summarizers\Sum::make()->label('Итого')),
                TextColumn::make('year')
                    ->label('Год')
                    ->state(fn ($record) => $record->original_year ?? $record->repress_year)
                    ->badge()
                    ->color(fn ($record) => $record->original_year ? 'warning' : 'info')
                    ->placeholder('—'),
                IconColumn::make('important')
                    ->label('Важно')
                    ->boolean()
                    ->sortable(),
                IconColumn::make('sealed')
                    ->label('Запечатан')
                    ->boolean()
                    ->toggleable(),
                // Основной сценарий: отметить покупку прямо из списка,
                // без захода в карточку
                ToggleColumn::make('purchased')
                    ->label('Куплено')
                    ->sortable(),
                IconColumn::make('sold_out')
                    ->label('Выкуплен')
                    ->boolean()
                    ->trueIcon('heroicon-o-x-circle')
                    ->falseIcon('heroicon-o-shopping-cart')
                    ->trueColor('danger')
                    ->falseColor('gray')
                    ->tooltip(fn ($record) => $record->sold_out ? 'Купить уже негде' : 'Ещё в продаже')
                    ->sortable(),
                TextColumn::make('checked_at')
                    ->label('Проверено')
                    ->since()
                    ->placeholder('никогда')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('purchased_at')
                    ->label('Когда куплено')
                    ->dateTime('d.m.Y')
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),
                IconColumn::make('is_published')
                    ->label('На сайте')
                    ->boolean()
                    ->toggleable(),
                TextColumn::make('sort_order')
                    ->label('Порядок')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TernaryFilter::make('purchased')
                    ->label('Куплено')
                    ->placeholder('Все')
                    ->trueLabel('Только купленные')
                    ->falseLabel('Только не купленные'),
                TernaryFilter::make('important')
                    ->label('В первую очередь')
                    ->placeholder('Все')
                    ->trueLabel('Только важные')
                    ->falseLabel('Кроме важных'),
                TernaryFilter::make('sealed')
                    ->label('Запечатан')
                    ->placeholder('Все')
                    ->trueLabel('Только запечатанные')
                    ->falseLabel('Кроме запечатанных'),
                TernaryFilter::make('sold_out')
                    ->label('Выкуплен в магазине')
                    ->placeholder('Все')
                    ->trueLabel('Только выкупленные')
                    ->falseLabel('Только доступные'),
                TernaryFilter::make('is_published')
                    ->label('Показывается на сайте')
                    ->placeholder('Все')
                    ->trueLabel('Только опубликованные')
                    ->falseLabel('Только черновики'),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                self::checkAvailabilityAction(),
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    /**
     * За раз проверяем не больше этого числа: каждая пластинка — это запрос
     * к магазину с паузой, и полторы сотни подряд не уложатся в веб-запрос.
     */
    private const BATCH_LIMIT = 50;

    /** Пауза между запросами, чтобы не выглядеть перебором страниц. */
    private const REQUEST_DELAY_MS = 400;

    /**
     * Проверяет выделенные пластинки: обновляет отметку «выкуплен» и цену
     * по странице магазина. Полный обход всех пластинок делает команда
     * app:check-availability — она не ограничена временем веб-запроса.
     */
    private static function checkAvailabilityAction(): BulkAction
    {
        return BulkAction::make('checkAvailability')
            ->label('Проверить наличие')
            ->icon(Heroicon::OutlinedArrowPath)
            ->color('gray')
            ->modalHeading('Проверить наличие в магазине')
            ->modalDescription('Обновим отметку «выкуплен» и цену по страницам магазина. Занимает примерно полсекунды на пластинку.')
            ->modalSubmitActionLabel('Проверить')
            ->deselectRecordsAfterCompletion()
            ->action(function (Collection $records) {
                if ($records->count() > self::BATCH_LIMIT) {
                    Notification::make()
                        ->title('Слишком много за один раз')
                        ->body('Выберите не больше '.self::BATCH_LIMIT.' пластинок — иначе проверка не успеет завершиться. Для полного обхода есть команда app:check-availability.')
                        ->warning()
                        ->send();

                    return;
                }

                $store = app(StoreDetails::class);
                $soldOut = [];
                $priceChanged = [];
                $failed = 0;

                foreach ($records as $vinyl) {
                    $state = $store->fetchAvailability($vinyl->link);

                    if ($state === null) {
                        $failed++;
                    } else {
                        $changed = $vinyl->applyAvailability($state);

                        if ($changed['became_sold_out']) {
                            $soldOut[] = "{$vinyl->artist} — {$vinyl->name}";
                        }
                        if ($changed['old_price'] !== null) {
                            $priceChanged[] = "{$vinyl->artist} — {$vinyl->name}: {$changed['old_price']} → {$vinyl->price} ₽";
                        }
                    }

                    usleep(self::REQUEST_DELAY_MS * 1000);
                }

                $lines = [];
                if ($soldOut) {
                    $lines[] = 'Выкупили: '.implode('; ', $soldOut);
                }
                if ($priceChanged) {
                    $lines[] = 'Цены: '.implode('; ', $priceChanged);
                }
                if ($failed) {
                    $lines[] = "Не удалось прочитать страниц: {$failed}";
                }

                Notification::make()
                    ->title($lines ? 'Проверено, есть изменения' : 'Проверено, всё по-прежнему')
                    ->body($lines ? implode(' • ', $lines) : 'Наличие и цены совпадают с магазином.')
                    ->{$soldOut || $failed ? 'warning' : 'success'}()
                    ->persistent()
                    ->send();
            });
    }
}
