<?php

namespace App\Http\Controllers;

use App\Models\ClassSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; 


class ClassSessionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() 
    {
        $results = DB::table('class_sessions')
            ->join('teaching_subject_classes', 'class_sessions.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->join('classes', 'teaching_subject_classes.classe_id', '=', 'classes.id')
            ->join('teachers', 'teaching_subject_classes.teacher_id', '=', 'teachers.id')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->select(
                'class_sessions.*',
                'classes.name as classe_name',
                'classes.id as classe_id',
                'subjects.name as subject_name',
                'teachers.firstname as teacher_firstname',
                'teachers.lastname as teacher_lastname'
            )
            ->whereNull('class_sessions.deleted_at')
            ->get();

        return response()->json([
            "status" => 202,
            "data" => $results
        ]);
    }

    /*
    Store a newly created resource in storage.
    'sessions_date',
    'start_time',
    'end_time',
    'teaching_subject_classe_id'
    */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "start_time" => "required|date_format:Y-m-d\TH:i:s\Z",
            "end_time" => "required|date_format:Y-m-d\TH:i:s\Z|after:start_time",
            "teaching_subject_classe_id" => "required|integer|exists:teaching_subject_classes,id",
        ]);

        $validated['start_time'] = Carbon::parse($validated['start_time'])->format('Y-m-d H:i:s');
        $validated['end_time'] = Carbon::parse($validated['end_time'])->format('Y-m-d H:i:s');

        $data = ClassSession::create($validated);

        return response()->json([
            "status" => 202,
            "data" => $data
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $results = DB::table('class_sessions')
            ->join('teaching_subject_classes', 'class_sessions.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->join('classes', 'teaching_subject_classes.classe_id', '=', 'classes.id')
            ->join('teachers', 'teaching_subject_classes.teacher_id', '=', 'teachers.id')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->select(
                'class_sessions.*',
                'classes.name as classe_name',
                'classes.id as classe_id',
                'subjects.name as subject_name',
                'teachers.firstname as teacher_firstname',
                'teachers.lastname as teacher_lastname'
            )
            ->where('classes.id', $id)
            ->whereNull('class_sessions.deleted_at')
            ->get();

        return response()->json([
            "status" => 202,
            "data" => $results
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            "start_time" => "required|date_format:Y-m-d\TH:i:s\Z",
            "end_time" => "required|date_format:Y-m-d\TH:i:s\Z|after:start_time",
            "teaching_subject_classe_id" => "required|integer|exists:teaching_subject_classes,id",
        ]);

        $validated['start_time'] = Carbon::parse($validated['start_time'])->format('Y-m-d H:i:s');
        $validated['end_time'] = Carbon::parse($validated['end_time'])->format('Y-m-d H:i:s');

        $session = ClassSession::findOrfail($id);

        $session->update($validated);

        return response()->json([
            "status" => 202,
            "data" => $session
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $session = ClassSession::findOrfail($id);

        $session->delete();

        return response()->json([
            "status" => 202, 
            "data" => $session
        ]);
    }
}
