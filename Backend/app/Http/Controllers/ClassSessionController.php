<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClassSessionRequest;
use App\Http\Requests\UpdateClassSessionRequest;
use App\Models\Classe;
use App\Models\ClassSession;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ClassSessionController extends Controller
{
    /**
     * Columns joined for display, shared by index/show/byClasse.
     */
    private function baseQuery()
    {
        return DB::table('class_sessions')
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
            ->whereNull('teaching_subject_classes.deleted_at')
            ->whereNull('classes.deleted_at')
            ->whereNull('teachers.deleted_at')
            ->whereNull('subjects.deleted_at');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $results = $this->baseQuery()
            ->orderBy('class_sessions.start_time')
            ->paginate(max(1, (int) request()->query('per_page', 15)));

        return $this->paginated($results);
    }

    /**
     * List all sessions of one classe (timetable view).
     */
    public function byClasse($class_id)
    {
        $results = $this->baseQuery()
            ->where('classes.id', $class_id)
            ->orderBy('class_sessions.start_time')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $results,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClassSessionRequest $request)
    {
        $validated = $request->validated();
        $validated['start_time'] = Carbon::parse($validated['start_time'])->format('Y-m-d H:i:s');
        $validated['end_time'] = Carbon::parse($validated['end_time'])->format('Y-m-d H:i:s');

        $data = ClassSession::create($validated);

        return response()->json([
            'status' => 201,
            'data' => $data,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $result = $this->baseQuery()->where('class_sessions.id', $id)->first();

        if (! $result) {
            return response()->json([
                'status' => 404,
                'message' => 'Session not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $result,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClassSessionRequest $request, $id)
    {
        $validated = $request->validated();
        $validated['start_time'] = Carbon::parse($validated['start_time'])->format('Y-m-d H:i:s');
        $validated['end_time'] = Carbon::parse($validated['end_time'])->format('Y-m-d H:i:s');

        $session = ClassSession::findOrFail($id);

        $session->update($validated);

        return response()->json([
            'status' => 200,
            'data' => $session,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $session = ClassSession::findOrFail($id);

        $session->delete();

        return response()->noContent();
    }
}
