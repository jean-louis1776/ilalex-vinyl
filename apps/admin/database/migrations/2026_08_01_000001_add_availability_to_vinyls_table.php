<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vinyls', function (Blueprint $table) {
            // Лот выкуплен в магазине. Не путать с purchased: там отметка
            // «я это купил», здесь — «купить уже негде, кто-то забрал».
            $table->boolean('sold_out')->default(false);
            // Когда наличие и цену последний раз сверяли с магазином
            $table->timestamp('checked_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('vinyls', function (Blueprint $table) {
            $table->dropColumn(['sold_out', 'checked_at']);
        });
    }
};
