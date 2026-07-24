<?php

use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentParentController;
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
    Route::get('/getstudents',function () {
       return User::all();
    });

    Route::get('/getparents',function () {
       return StudentParent::all();
    });

    Route::get('/getparentsid',function () {
       return StudentParent::all()->only(["id" , "firstname" , "lastname"]);
    });

    Route::apiResources([
        'students' => StudentController::class,
    ]);

    Route::apiResources([
        'parents' => StudentParentController::class,
    ]);
});




