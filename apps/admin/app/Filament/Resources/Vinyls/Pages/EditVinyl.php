<?php

namespace App\Filament\Resources\Vinyls\Pages;

use App\Filament\Resources\Vinyls\VinylResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditVinyl extends EditRecord
{
    protected static string $resource = VinylResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
