<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class GetClasseByTeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $teacherId = (int) auth()->id();

        if (!$teacherId) {
            return response()->json([
                'status' => 400,
                'message' => 'teacher_id query parameter is required.',
            ], 400);
        }

        $results = DB::table('teaching_subject_classes')
            ->join('classes', 'teaching_subject_classes.classe_id', '=', 'classes.id')
            ->select('classes.id', 'classes.name')
            ->where('teaching_subject_classes.teacher_id', $teacherId)
            ->distinct()
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $results,
        ], 200);
    }
}
 