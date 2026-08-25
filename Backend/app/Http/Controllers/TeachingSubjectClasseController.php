<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeachingSubjectClasseRequest;
use App\Http\Requests\UpdateTeachingSubjectClasseRequest;
use App\Models\TeachingSubjectClasse;
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
            ->whereNull('teachers.deleted_at')
            ->whereNull('subjects.deleted_at')
            ->whereNull('classes.deleted_at')
            ->orderByDesc('teaching_subject_classes.id')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $results,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTeachingSubjectClasseRequest $request)
    {
        $data = TeachingSubjectClasse::create($request->validated());

        return response()->json([
            'status' => 201,
            'data' => $data,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TeachingSubjectClasse $teaching)
    {
        return response()->json([
            'status' => 200,
            'data' => $teaching,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeachingSubjectClasseRequest $request, $id)
    {
        $classe = TeachingSubjectClasse::findOrFail($id);

        $classe->update($request->validated());

        return response()->json([
            'status' => 200,
            'data' => $classe,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $classe = TeachingSubjectClasse::findOrFail($id);

        $classe->delete();

        return response()->noContent();
    }
}
