<?php

namespace App\Filament\Resources\Vinyls\Pages;

use App\Filament\Resources\Vinyls\VinylResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListVinyls extends ListRecords
{
    protected static string $resource = VinylResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->label('Добавить пластинку'),
        ];
    }
}
