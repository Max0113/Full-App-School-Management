<?php

use App\Http\Controllers\CountController;
use App\Http\Controllers\LevelController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentParentController;
use App\Http\Controllers\TeacherController;
use App\Models\StudentParent;
use App\Models\User;
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
    Route::get("/staticNumbers" , [CountController::class , 'count']);

     Route::apiResources([
        'levels' => LevelController::class,
    ]);

    Route::apiResources([
        'students' => StudentController::class,
    ]);

    Route::apiResources([
        'teachers' => TeacherController::class,
    ]);

    Route::apiResources([
        'parents' => StudentParentController::class,
    ]);
});




