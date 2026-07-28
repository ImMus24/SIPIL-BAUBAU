<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('citizen'); // 'admin', 'officer', 'citizen'
            $table->foreignId('agency_id')->nullable()->constrained('agencies')->nullOnDelete();
            $table->string('phone')->nullable();
            $table->string('avatar')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['agency_id']);
            $table->dropColumn(['role', 'agency_id', 'phone', 'avatar']);
        });
    }
};
