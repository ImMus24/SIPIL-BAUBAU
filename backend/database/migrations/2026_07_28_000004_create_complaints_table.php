<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_code')->unique();
            $table->string('title');
            $table->text('description');
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignId('agency_id')->nullable()->constrained('agencies')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('reporter_name');
            $table->string('reporter_phone')->nullable();
            $table->string('reporter_email')->nullable();
            $table->string('address');
            $table->enum('subdistrict', [
                'Wolio',
                'Betoambari',
                'Murhum',
                'Kokalukuna',
                'Lea-Lea',
                'Sorawolio',
                'Bungi',
                'Batupoaro'
            ])->default('Wolio');
            $table->decimal('latitude', 10, 7)->default(-5.4642000);
            $table->decimal('longitude', 10, 7)->default(122.6035000);
            $table->enum('urgency', ['rendah', 'sedang', 'tinggi', 'darurat'])->default('sedang');
            $table->enum('status', ['menunggu', 'diproses', 'selesai', 'ditolak'])->default('menunggu');
            $table->text('rejection_reason')->nullable();
            $table->date('estimated_completion_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
