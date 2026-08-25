<?php

use App\Http\Controllers\AbsenceController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\ClassSessionController;
use App\Http\Controllers\CountController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\LevelController;
use App\Http\Controllers\SchoolYearController;
use App\Http\Controllers\SpecialiteController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentParentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TeachingSubjectClasseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum', 'ability:student'])->group(static function () {
    //
});

Route::middleware(['auth:sanctum', 'ability:teacher'])->group(static function () {
    //
});

Route::middleware(['auth:sanctum', 'ability:admin'])->group(static function () {

    Route::get('/staticNumbers', [CountController::class, 'count']);

    // Timetable: sessions of one classe (explicit route kept out of the resource).
    Route::get('sessions/classe/{classe}', [ClassSessionController::class, 'byClasse']);

    // --- Account ---

    Route::apiResources([
        'students' => StudentController::class,
    ]);

    Route::apiResources([
        'teachers' => TeacherController::class,
    ]);

    Route::apiResources([
        'parents' => StudentParentController::class,
    ]);

    Route::apiResources([
        'admins' => AdminController::class,
    ]);

    // --- Setting School ---
    
    Route::apiResources([
        'classes' => ClasseController::class,
    ]);

    Route::apiResources([
        'specialites' => SpecialiteController::class,
    ]);

    Route::apiResources([
        'subjects' => SubjectController::class,
    ]);

    Route::apiResources([
        'levels' => LevelController::class,
    ]);

    Route::apiResources([
        'schoolyears' => SchoolYearController::class,
    ]);

    // --- Sessions & Teachings ---

    Route::apiResources([
        'sessions' => ClassSessionController::class,
    ]);

    Route::apiResources([
        'teachings' => TeachingSubjectClasseController::class,
    ]);

    // --- Exams & grades ---
    Route::get('grades/report-card/{student}', [GradeController::class, 'reportCard']);

    Route::apiResources([
        'exams' => ExamController::class,
    ]);

    Route::apiResources([
        'grades' => GradeController::class,
    ]);

    // --- Absences ---
    Route::post('absences/bulk', [AbsenceController::class, 'bulkStore']);
    Route::patch('absences/{absence}/justify', [AbsenceController::class, 'justify']);

    Route::apiResources([
        'absences' => AbsenceController::class,
    ]);

});
