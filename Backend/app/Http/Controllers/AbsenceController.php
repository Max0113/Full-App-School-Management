<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAbsenceRequest;
use App\Http\Requests\UpdateAbsenceRequest;
use App\Models\Absence;
use Illuminate\Support\Facades\DB;

class AbsenceController extends Controller
{
    /**
     * Display a listing of the resource. Filters: class_session_id, user_id, classe_id.
     */
    public function index()
    {
        $query = DB::table('absences')
            ->join('class_sessions', 'absences.class_session_id', '=', 'class_sessions.id')
            ->join('teaching_subject_classes', 'class_sessions.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->join('classes', 'teaching_subject_classes.classe_id', '=', 'classes.id')
            ->join('users', 'absences.user_id', '=', 'users.id')
            ->select(
                'absences.*',
                'class_sessions.start_time',
                'class_sessions.end_time',
                'classes.name as classe_name',
                'classes.id as classe_id',
                'users.firstname as student_firstname',
                'users.lastname as student_lastname'
            )
            ->whereNull('absences.deleted_at')
            ->orderByDesc('class_sessions.start_time');

        if ($sessionId = request()->query('class_session_id')) {
            $query->where('absences.class_session_id', $sessionId);
        }
        if ($userId = request()->query('user_id')) {
            $query->where('absences.user_id', $userId);
        }
        if ($classeId = request()->query('classe_id')) {
            $query->where('classes.id', $classeId);
        }

        return $this->paginated($query->paginate(max(1, (int) request()->query('per_page', 15))));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAbsenceRequest $request)
    {
        $validate = $request->validated();
        $validate['justified'] = false;
        $absence = Absence::create($validate);

        return response()->json([
            'status' => 201,
            'data' => $absence,
        ], 201);
    }

    /**
     * Mark multiple students absent for one session (attendance sheet).
     */
    public function bulkStore()
    {
        $validated = request()->validate([
            'class_session_id' => 'required|integer|exists:class_sessions,id',
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'required|integer|distinct|exists:users,id',
        ]);

        $created = 0;
        foreach ($validated['user_ids'] as $userId) {
            Absence::firstOrCreate(
                [
                    'class_session_id' => $validated['class_session_id'],
                    'user_id' => $userId,
                ],
                ['justified' => false]
            );
            $created++;
        }

        return response()->json([
            'status' => 201,
            'message' => "{$created} absence(s) recorded.",
            'data' => [
                'class_session_id' => $validated['class_session_id'],
                'count' => $created,
            ],
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Absence $absence)
    {
        return response()->json([
            'status' => 200,
            'data' => $absence,
        ]);
    }

    /**
     * Justify an absence without changing the session or student.
     */
    public function justify(Absence $absence)
    {
        request()->validate(['justified' => 'sometimes|boolean']);

        $absence->update(['justified' => (bool) request()->boolean('justified', true)]);

        return response()->json([
            'status' => 200,
            'data' => $absence,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAbsenceRequest $request, Absence $absence)
    {
        $validate = $request->validated();
        $validate['justified'] = $absence->justified;
        $absence->update($validate);

        return response()->json([
            'status' => 200,
            'data' => $absence,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Absence $absence)
    {
        $absence->delete();

        return response()->noContent();
    }
}
