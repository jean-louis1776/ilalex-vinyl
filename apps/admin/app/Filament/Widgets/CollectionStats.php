<?php

namespace App\Filament\Widgets;

use App\Models\Vinyl;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

/** Те же цифры, что и в шапке сайта: сколько куплено, потрачено, осталось. */
class CollectionStats extends StatsOverviewWidget
{
    protected static ?int $sort = -1;

    protected function getStats(): array
    {
        $published = Vinyl::query()->where('is_published', true);

        $total = (clone $published)->count();
        $purchased = (clone $published)->where('purchased', true)->count();
        $spent = (int) (clone $published)->where('purchased', true)->sum('price');
        $remaining = (int) (clone $published)->where('purchased', false)->sum('price');
        $percent = $total > 0 ? round($purchased / $total * 100) : 0;

        return [
            Stat::make('Куплено', "{$purchased} из {$total}")
                ->description("{$percent}% коллекции")
                ->color('success'),
            Stat::make('Потрачено', self::money($spent))
                ->color('success'),
            Stat::make('Осталось', self::money($remaining))
                ->description('на не купленные пластинки'),
        ];
    }

    private static function money(int $value): string
    {
        return number_format($value, 0, ',', ' ').' ₽';
    }
}
