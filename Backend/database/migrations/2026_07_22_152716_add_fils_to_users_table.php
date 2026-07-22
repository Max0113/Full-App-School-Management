<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('name');
            $table->string('firstname', 50)->after('id');
            $table->string('lastname', 50)->after('firstname');
            $table->dateTime('date_of_birth')->after('student_parent_id');
            $table->dateTime('last_login_date')->after('date_of_birth');
            $table->string('address')->after('password');
            $table->string('phone', 10)->unique()->after('address');
            $table->enum('gender', ['m', 'f'])->after('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->nullable();
            $table->dropColumn(['firstname', 'lastname', 'date_of_birth', 'last_login_date', 'address', 'phone', 'gender']);
        });
    }
};
