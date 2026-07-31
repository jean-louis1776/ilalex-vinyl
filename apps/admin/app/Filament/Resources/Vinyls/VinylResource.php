<?php

namespace App\Filament\Resources\Vinyls;

use App\Filament\Resources\Vinyls\Pages\CreateVinyl;
use App\Filament\Resources\Vinyls\Pages\EditVinyl;
use App\Filament\Resources\Vinyls\Pages\ListVinyls;
use App\Filament\Resources\Vinyls\Schemas\VinylForm;
use App\Filament\Resources\Vinyls\Tables\VinylsTable;
use App\Models\Vinyl;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class VinylResource extends Resource
{
    protected static ?string $model = Vinyl::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMusicalNote;

    protected static ?string $modelLabel = 'пластинка';

    protected static ?string $pluralModelLabel = 'Пластинки';

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return VinylForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return VinylsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListVinyls::route('/'),
            'create' => CreateVinyl::route('/create'),
            'edit' => EditVinyl::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return (string) Vinyl::query()->count();
    }
}
