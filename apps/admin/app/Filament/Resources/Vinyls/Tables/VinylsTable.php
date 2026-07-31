<?php

namespace App\Filament\Resources\Vinyls\Tables;

use App\Support\CoverImage;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
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
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
