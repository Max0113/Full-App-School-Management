<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ---------- users (email + phone + code_masser) ----------
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['email']);
            $table->dropUnique(['phone']);
            $table->dropUnique(['code_masser']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('email_unique')->nullable()
                ->virtualAs("CONCAT(email, '#', IF(deleted_at IS NULL, '-', deleted_at))");

            $table->string('phone_unique')->nullable()
                ->virtualAs("CONCAT(phone, '#', IF(deleted_at IS NULL, '-', deleted_at))");

            $table->string('code_masser_unique')->nullable()
                ->virtualAs("CONCAT(code_masser, '#', IF(deleted_at IS NULL, '-', deleted_at))");
        });

        Schema::table('users', function (Blueprint $table) {
            $table->unique('email_unique');
            $table->unique('phone_unique');
            $table->unique('code_masser_unique');
        });

        // ---------- teachers / admins / student_parents (cin + phone) ----------
        foreach (['teachers', 'admins', 'student_parents'] as $table) {
            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->dropUnique(['email']);
                $blueprint->dropUnique(['cin']);
                $blueprint->dropUnique(['phone']);
            });

            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->string('email_unique')->nullable()
                    ->virtualAs("CONCAT(email, '#', IF(deleted_at IS NULL, '-', deleted_at))");

                $blueprint->string('cin_unique')->nullable()
                    ->virtualAs("CONCAT(cin, '#', IF(deleted_at IS NULL, '-', deleted_at))");

                $blueprint->string('phone_unique')->nullable()
                    ->virtualAs("CONCAT(phone, '#', IF(deleted_at IS NULL, '-', deleted_at))");
            });

            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->unique('email_unique');
                $blueprint->unique('cin_unique');
                $blueprint->unique('phone_unique');
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['email_unique']);
            $table->dropUnique(['phone_unique']);
            $table->dropUnique(['code_masser_unique']);
            $table->dropColumn(['email_unique', 'phone_unique', 'code_masser_unique']);
            $table->unique('email');
            $table->unique('phone');
            $table->unique('code_masser');
        });

        foreach (['teachers', 'admins', 'student_parents'] as $table) {
            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->dropUnique(['cin_unique']);
                $blueprint->dropUnique(['phone_unique']);
                $blueprint->dropUnique(['email_unique']);
                $blueprint->dropColumn(['cin_unique', 'phone_unique', 'email_unique']);
                $blueprint->unique('cin');
                $blueprint->unique('phone');
                $blueprint->unique('email');
            });
        }
    }
};