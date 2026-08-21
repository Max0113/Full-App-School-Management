<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Fix unusable financial columns and wrong enum values flagged in BACKEND_ANALYSIS.md (C6 + minors).
     */
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->decimal('amount', 10, 2)->change();
            $table->enum('type_payment', ['cash', 'online'])->default('cash')->change();
        });

        Schema::table('salaries', function (Blueprint $table) {
            $table->decimal('amount', 10, 2)->change();
        });

        Schema::table('grades', function (Blueprint $table) {
            $table->decimal('note', 4, 2)->default(0)->change();
        });

        // last_login_date must be nullable: it is set on first login, not at account creation (M9).
        Schema::table('users', function (Blueprint $table) {
            $table->dateTime('last_login_date')->nullable()->change();
        });

        Schema::table('student_parents', function (Blueprint $table) {
            $table->dateTime('last_login_date')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->unsignedTinyInteger('amount')->change();
            $table->enum('type_payment', ['cache', 'online'])->default('cache')->change();
        });

        Schema::table('salaries', function (Blueprint $table) {
            $table->unsignedTinyInteger('amount')->change();
        });

        Schema::table('grades', function (Blueprint $table) {
            $table->unsignedTinyInteger('note')->default(0)->change();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dateTime('last_login_date')->change();
        });

        Schema::table('student_parents', function (Blueprint $table) {
            $table->dateTime('last_login_date')->change();
        });
    }
};
