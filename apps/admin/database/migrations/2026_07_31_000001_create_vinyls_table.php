<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vinyls', function (Blueprint $table) {
            $table->id();
            $table->string('artist');
            $table->string('name');
            // Цена в рублях, целыми — копейки в каталоге не используются
            $table->unsignedInteger('price')->default(0);
            $table->string('link', 1024);
            $table->string('image', 1024);
            // Год оригинального издания / переиздания — на сайте это теги
            $table->unsignedSmallInteger('original_year')->nullable();
            $table->unsignedSmallInteger('repress_year')->nullable();
            $table->boolean('important')->default(false);
            $table->boolean('sealed')->default(false);
            // Тот самый переключатель «куплено» — единственный источник правды
            $table->boolean('purchased')->default(false);
            $table->timestamp('purchased_at')->nullable();
            // Черновик: строка есть в базе, но в публичный API не попадает
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['is_published', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vinyls');
    }
};
