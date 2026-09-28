<?php

use App\Http\Controllers\AbsenceController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\ClassSessionController;
use App\Http\Controllers\CountController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\LevelController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\SchoolYearController;
use App\Http\Controllers\SpecialiteController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentParentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TeacherDashboardController;
use App\Http\Controllers\TeacherFeaturesController;
use App\Http\Controllers\TeachingSubjectClasseController;
use App\Http\Controllers\GetClasseByTeacherController;
use App\Http\Controllers\Parent\ParentFeaturesController;
use App\Http\Controllers\Student\StudentFeaturesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {

    return $request->user();

});

Route::middleware(['auth:sanctum', 'ability:student'])->prefix('student')->group(static function () {
    Route::get('/dashboard', [StudentFeaturesController::class, 'dashboard']);
    Route::get('/grades', [StudentFeaturesController::class, 'grades']);
    Route::get('/sessions', [StudentFeaturesController::class, 'sessions']);
    Route::get('/exams', [StudentFeaturesController::class, 'exams']);
    Route::get('/absences', [StudentFeaturesController::class, 'absences']);
    Route::get('/teachers', [StudentFeaturesController::class, 'teachers']);
    Route::get('/school-info', [StudentFeaturesController::class, 'schoolInfo']);
});

Route::middleware(['auth:sanctum', 'ability:teacher'])->prefix('teacher')->group(static function () {

    Route::get('/dashboard/stats', [TeacherDashboardController::class, 'stats']);

    Route::get('/my-classes', [ClasseController::class, 'classes']);
    Route::get('/my-students', [ClasseController::class, 'students']);

    Route::get('/teacher-classes', [GetClasseByTeacherController::class, 'index']);
    
    Route::get('/sessions/classe/{teacher_id}', [ClassSessionController::class, 'byTeacher']);

    Route::get('/exams', [TeacherFeaturesController::class, 'exams']);
    Route::post('/exams', [TeacherFeaturesController::class, 'storeExam']);
    Route::patch('/exams/{examId}', [TeacherFeaturesController::class, 'updateExam']);
    Route::delete('/exams/{examId}', [TeacherFeaturesController::class, 'destroyExam']);
    Route::get('/exams/{examId}/students', [TeacherFeaturesController::class, 'examStudents']);

    Route::get('/grades', [TeacherFeaturesController::class, 'grades']);
    Route::post('/grades', [TeacherFeaturesController::class, 'storeGrade']);
    Route::patch('/grades/{gradeId}', [TeacherFeaturesController::class, 'updateGrade']);
    Route::delete('/grades/{gradeId}', [TeacherFeaturesController::class, 'destroyGrade']);

    Route::get('/parents', [TeacherFeaturesController::class, 'parents']);

});

Route::middleware(['auth:sanctum', 'ability:parent'])->prefix('parent')->group(static function () {
    Route::get('/dashboard', [ParentFeaturesController::class, 'dashboard']);
    Route::get('/children', [ParentFeaturesController::class, 'children']);
    Route::get('/grades', [ParentFeaturesController::class, 'grades']);
    Route::get('/sessions', [ParentFeaturesController::class, 'sessions']);
    Route::get('/exams', [ParentFeaturesController::class, 'exams']);
    Route::get('/absences', [ParentFeaturesController::class, 'absences']);
    Route::get('/teachers', [ParentFeaturesController::class, 'teachers']);
    Route::get('/school-info', [ParentFeaturesController::class, 'schoolInfo']);
});

Route::middleware(['auth:sanctum', 'ability:admin'])->prefix('admin')->group(static function () {

    Route::get('/staticNumbers', [CountController::class, 'count']);

    Route::get('/dashboard/stats', [CountController::class, 'stats']);

    // Timetable: sessions of one classe (explicit route kept out of the resource).
    Route::get('sessions/classe/{class_id}', [ClassSessionController::class, 'byClasse']);

    // --- Account ---
    
    Route::apiResources([
        '/students' => StudentController::class,
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

    // --- Rooms ---

    Route::apiResources([
        'rooms' => RoomController::class,
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
