<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vinyls', function (Blueprint $table) {
            // Состояние винила и конверта в градации Goldmine (NM, EX+, VG…),
            // как указано в карточке магазина
            $table->string('condition')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('vinyls', function (Blueprint $table) {
            $table->dropColumn('condition');
        });
    }
};
