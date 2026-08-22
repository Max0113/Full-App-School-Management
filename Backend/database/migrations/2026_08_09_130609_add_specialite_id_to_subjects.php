<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Specialite;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            $table->foreignIdFor(Specialite::class)
                      ->constrained()
                      ->cascadeOnDelete();
            $table->unsignedInteger('facture');
        });
    }

    public function down(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            $table->dropForeign(['specialite_id']);
            $table->dropColumn(['specialite_id', 'facture']);
        });
    }
};