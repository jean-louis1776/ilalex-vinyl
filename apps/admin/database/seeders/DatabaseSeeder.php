<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Пользователей здесь намеренно нет: админы заводятся интерактивно через
     * `php artisan app:make-admin`, чтобы никаких учёток не было в коде.
     */
    public function run(): void
    {
        $this->call(VinylSeeder::class);
    }
}
