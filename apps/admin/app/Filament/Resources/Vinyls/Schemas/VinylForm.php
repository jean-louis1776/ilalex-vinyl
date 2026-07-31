<?php

namespace App\Filament\Resources\Vinyls\Schemas;

use App\Support\CoverImage;
use App\Support\StoreDetails;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Image;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Text;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class VinylForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Пластинка')
                    ->columns(2)
                    ->components([
                        TextInput::make('artist')
                            ->label('Исполнитель')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('name')
                            ->label('Альбом')
                            ->helperText('Как на сайте: «The Man I Love (UK), 1984»')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('price')
                            ->label('Цена, ₽')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->default(0),
                        TextInput::make('link')
                            ->label('Ссылка на магазин')
                            ->helperText('Открывается по кнопке «Купить» на странице пластинки')
                            ->url()
                            ->required()
                            ->maxLength(1024)
                            ->columnSpanFull(),
                    ]),

                Section::make('Описание')
                    ->description('Показывается на странице пластинки. Если оставить пусто, сайт соберёт краткую сводку сам.')
                    ->columns(3)
                    ->afterHeader([
                        // Достаёт жанр, страну, лейбл и состояние прямо со
                        // страницы магазина по ссылке из поля выше
                        Action::make('fetchDetails')
                            ->label('Подтянуть с сайта магазина')
                            ->icon(Heroicon::OutlinedArrowDownTray)
                            ->color('gray')
                            ->action(function (Get $get, Set $set) {
                                $details = app(StoreDetails::class)->fetch($get('link'));

                                if ($details === null) {
                                    Notification::make()
                                        ->title('Не удалось прочитать страницу магазина')
                                        ->body('Проверьте ссылку — она должна вести на карточку товара.')
                                        ->danger()
                                        ->send();

                                    return;
                                }

                                $filled = [];
                                foreach (['genre' => 'жанр', 'country' => 'страна', 'label' => 'лейбл', 'condition' => 'состояние'] as $field => $title) {
                                    if ($details[$field] !== null) {
                                        $set($field, $details[$field]);
                                        $filled[] = $title;
                                    }
                                }

                                Notification::make()
                                    ->title($filled ? 'Заполнено: '.implode(', ', $filled) : 'На странице ничего не нашлось')
                                    ->success()
                                    ->send();
                            }),
                    ])
                    ->components([
                        Textarea::make('description')
                            ->label('Текст описания')
                            ->rows(6)
                            ->maxLength(4000)
                            ->columnSpanFull(),
                        TextInput::make('label')
                            ->label('Лейбл')
                            ->maxLength(255)
                            ->placeholder('Polydor'),
                        TextInput::make('country')
                            ->label('Страна издания')
                            ->maxLength(255)
                            ->placeholder('UK'),
                        TextInput::make('genre')
                            ->label('Жанр')
                            ->maxLength(255)
                            ->placeholder('Synth-pop'),
                        TextInput::make('condition')
                            ->label('Состояние')
                            ->maxLength(255)
                            ->placeholder('NM / EX+')
                            ->helperText('Винил / конверт по шкале Goldmine'),
                    ]),

                Section::make('Обложка')
                    ->description('Вставьте прямую ссылку на картинку — предпросмотр обновится по выходу из поля.')
                    ->columns(2)
                    ->components([
                        TextInput::make('image')
                            ->label('Ссылка на изображение')
                            ->url()
                            ->required()
                            ->maxLength(1024)
                            // live: предпросмотр справа перерисовывается, как
                            // только фокус уходит из поля
                            ->live(onBlur: true)
                            ->helperText('Например: https://vinylpark.ru/upload/iblock/…/cover.jpg'),

                        Grid::make(1)->components([
                            Image::make(
                                fn (Get $get): string => CoverImage::proxy($get('image')) ?? '',
                                'Предпросмотр обложки',
                            )
                                ->imageSize(200)
                                ->visible(fn (Get $get): bool => CoverImage::proxy($get('image')) !== null),

                            Text::make('Ссылка пустая или не начинается с http(s) — предпросмотра не будет.')
                                ->color('gray')
                                ->visible(fn (Get $get): bool => CoverImage::proxy($get('image')) === null),

                            Text::make('Картинка грузится через прокси weserv — ровно как на сайте. Если её не видно здесь, не будет видно и посетителю.')
                                ->size('xs')
                                ->color('gray'),
                        ]),
                    ]),

                Section::make('Метки')
                    ->description('Из них собираются теги и фильтры на сайте.')
                    ->columns(2)
                    ->components([
                        TextInput::make('original_year')
                            ->label('Год оригинала')
                            ->numeric()
                            ->minValue(1900)
                            ->maxValue(2100)
                            ->helperText('Пусто, если это переиздание'),
                        TextInput::make('repress_year')
                            ->label('Год переиздания')
                            ->numeric()
                            ->minValue(1900)
                            ->maxValue(2100),
                        Toggle::make('important')
                            ->label('В первую очередь')
                            ->helperText('Такие пластинки поднимаются в начало списка'),
                        Toggle::make('sealed')
                            ->label('Запечатан'),
                    ]),

                Section::make('Статус')
                    ->columns(2)
                    ->components([
                        Toggle::make('purchased')
                            ->label('Куплено')
                            ->helperText('Тот самый переключатель — раньше он жил на сайте под PIN-кодом')
                            ->live(),
                        Toggle::make('is_published')
                            ->label('Показывать на сайте')
                            ->default(true)
                            ->helperText('Выключите, чтобы придержать пластинку черновиком'),
                        TextInput::make('sort_order')
                            ->label('Порядок')
                            ->numeric()
                            ->default(0)
                            ->helperText('Меньше — выше в списке при сортировке «по умолчанию»'),
                    ]),
            ]);
    }
}
