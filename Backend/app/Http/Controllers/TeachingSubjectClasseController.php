<?php

namespace App\Http\Controllers;

use App\Models\TeachingSubjectClasse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeachingSubjectClasseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $results = DB::table('teaching_subject_classes')
            ->join('teachers', 'teaching_subject_classes.teacher_id', '=', 'teachers.id')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->join('classes', 'teaching_subject_classes.classe_id', '=', 'classes.id')
            ->select(
                'teaching_subject_classes.*',
                'teachers.firstname as teachers_firstname',
                'teachers.lastname as teachers_lastname',
                'subjects.name as subjects_name',
                'classes.name as classes_name'
            )
            ->whereNull('teaching_subject_classes.deleted_at')
            ->get();

        return response()->json([
            "status" => 200,
            "data" => $results
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "teacher_id" => "required|integer|exists:teachers,id",
            "subject_id" => "required|integer|exists:subjects,id",
            "classe_id" => "required|integer|exists:classes,id",
        ]);

        $data = TeachingSubjectClasse::create($validated);

        return response()->json([
            "status" => 202,
            "data" => $data
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(TeachingSubjectClasse $classe)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,$id)
    {
        $validated = $request->validate([
            "teacher_id" => "required|integer|exists:teachers,id",
            "subject_id" => "required|integer|exists:subjects,id",
            "classe_id" => "required|integer|exists:classes,id",
        ]);

        $classe = TeachingSubjectClasse::findOrFail($id);

        $classe->update($validated);

        return response()->json([
            "status" => 202,
            "data" => $classe
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $classe = TeachingSubjectClasse::findOrFail($id);

        $classe->delete();

        return response()->json([
            "status" => 202,
            "data" => $classe
        ], 202);
    }
}
