<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\StudentParent;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;

class CountController extends Controller
{
    public function count() {
        $parent = count(StudentParent::all());
        $student = count(User::all());
        $teacher = count(Teacher::all());
        $admin = count(Admin::all());

        return response()->json([
            "parent" => $parent,
            "student" => $student,
            "teacher" => $teacher,
            "admin" => $admin,
        ]);
    }
}
