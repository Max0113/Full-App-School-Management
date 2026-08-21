<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGradeRequest;
use App\Http\Requests\UpdateGradeRequest;
use App\Models\Grade;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class GradeController extends Controller
{
    /**
     * Display a listing of the resource. Filters: exam_id, user_id, classe_id.
     */
    public function index()
    {
        $query = DB::table('grades')
            ->join('exams', 'grades.exam_id', '=', 'exams.id')
            ->join('teaching_subject_classes', 'exams.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->join('users', 'grades.user_id', '=', 'users.id')
            ->select(
                'grades.*',
                'exams.name as exam_name',
                'exams.type as exam_type',
                'exams.exam_date',
                'subjects.name as subject_name',
                'users.firstname as student_firstname',
                'users.lastname as student_lastname'
            )
            ->whereNull('grades.deleted_at')
            ->orderByDesc('grades.id');

        if ($examId = request()->query('exam_id')) {
            $query->where('grades.exam_id', $examId);
        }
        if ($userId = request()->query('user_id')) {
            $query->where('grades.user_id', $userId);
        }
        if ($classeId = request()->query('classe_id')) {
            $query->where('teaching_subject_classes.classe_id', $classeId);
        }

        return $this->paginated($query->paginate(max(1, (int) request()->query('per_page', 15))));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGradeRequest $request)
    {
        $grade = Grade::create($request->validated());

        return response()->json([
            'status' => 201,
            'data' => $grade,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Grade $grade)
    {
        return response()->json([
            'status' => 200,
            'data' => $grade,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGradeRequest $request, Grade $grade)
    {
        $grade->update($request->validated());

        return response()->json([
            'status' => 200,
            'data' => $grade,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Grade $grade)
    {
        $grade->delete();

        return response()->noContent();
    }

    /**
     * Report card: grades grouped by subject with averages for one student.
     */
    public function reportCard(User $student)
    {
        $rows = DB::table('grades')
            ->join('exams', 'grades.exam_id', '=', 'exams.id')
            ->join('teaching_subject_classes', 'exams.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->where('grades.user_id', $student->id)
            ->whereNull('grades.deleted_at')
            ->select(
                'subjects.name as subject_name',
                'grades.note',
                'exams.name as exam_name',
                'exams.type as exam_type',
                'grades.appreciation'
            )
            ->get();

        $subjects = $rows
            ->groupBy('subject_name')
            ->map(fn ($items, $name) => [
                'subject' => $name,
                'average' => round($items->avg('note'), 2),
                'count' => $items->count(),
                'grades' => $items->values(),
            ])
            ->values();

        return response()->json([
            'status' => 200,
            'data' => [
                'student' => [
                    'id' => $student->id,
                    'firstname' => $student->firstname,
                    'lastname' => $student->lastname,
                ],
                'subjects' => $subjects,
                'overall_average' => $rows->isEmpty() ? null : round($rows->avg('note'), 2),
            ],
        ]);
    }
}
