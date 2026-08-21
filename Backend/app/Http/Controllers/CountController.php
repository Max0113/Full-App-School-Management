<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\StudentParent;
use App\Models\Teacher;
use App\Models\User;

class CountController extends Controller
{
    public function count()
    {
        $parent = StudentParent::count();
        $student = User::count();
        $teacher = Teacher::count();
        $admin = Admin::count();

        return response()->json([
            'parent' => $parent,
            'student' => $student,
            'teacher' => $teacher,
            'admin' => $admin,
        ]);
    }
}
