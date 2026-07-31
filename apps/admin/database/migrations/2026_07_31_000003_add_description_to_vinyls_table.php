<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vinyls', function (Blueprint $table) {
            // Описание для страницы пластинки на сайте. Пусто — страница
            // показывает автоматическую сводку по годам и меткам.
            $table->text('description')->nullable();
            // Дополнительные поля с обложки/этикетки, все необязательные
            $table->string('label')->nullable();
            $table->string('country')->nullable();
            $table->string('genre')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('vinyls', function (Blueprint $table) {
            $table->dropColumn(['description', 'label', 'country', 'genre']);
        });
    }
};
