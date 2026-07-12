<?php

use App\Http\Controllers\StudentParentController;
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
    Route::get('/getusers',function (Request $request) {
       return User::all();
    });

    Route::apiResources([
        'parents' => StudentParentController::class,
    ]);
});




