<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\Classe;

return new class extends Migration
{
    /**
     * Move existing memberships into the student_classes pivot, then drop
     * the denormalised classe_id column from users.
     */
    public function up(): void
    {
        DB::table('users')
            ->join('classes', 'users.classe_id', '=', 'classes.id')
            ->whereNotNull('users.classe_id')
            ->whereNotNull('classes.school_year_id')
            ->select('users.id', 'users.id as student_id', 'users.classe_id', 'classes.school_year_id')
            ->orderBy('users.id')
            ->chunkById(200, function ($rows) {
                $pivots = $rows->map(fn ($row) => [
                    'student_id' => $row->student_id,
                    'classe_id' => $row->classe_id,
                    'school_year_id' => $row->school_year_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ])->all();

                DB::table('student_classes')->insertOrIgnore($pivots);
            }, 'users.id', 'id');

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['classe_id']);
            $table->dropColumn('classe_id');
        });
    }

    /**
     * Re-add the column and restore the latest membership for every student.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignIdFor(Classe::class)->nullable()
                ->after('student_parent_id')
                ->constrained()
                ->cascadeOnDelete();
        });

        $latestIds = DB::table('student_classes')
            ->select('student_id', DB::raw('MAX(id) as id'))
            ->groupBy('student_id')
            ->pluck('id');

        DB::table('student_classes')
            ->whereIn('id', $latestIds)
            ->each(function ($row) {
                DB::table('users')
                    ->where('id', $row->student_id)
                    ->update(['classe_id' => $row->classe_id]);
            });
    }
};