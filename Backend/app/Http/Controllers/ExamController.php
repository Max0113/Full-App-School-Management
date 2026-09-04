<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExamRequest;
use App\Http\Requests\UpdateExamRequest;
use App\Models\Exam;
use Illuminate\Support\Facades\DB;

class ExamController extends Controller
{
    /**
     * Display a listing of the resource. Filters: teaching_subject_classe_id, classe_id.
     */
    public function index()
    {
        $query = DB::table('exams')
            ->join('teaching_subject_classes', 'exams.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->join('classes', 'teaching_subject_classes.classe_id', '=', 'classes.id')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->join('teachers', 'teaching_subject_classes.teacher_id', '=', 'teachers.id')
            ->select(
                'exams.*',
                'classes.name as classe_name',
                'classes.id as classe_id',
                'subjects.name as subject_name',
                'teachers.firstname as teacher_firstname',
                'teachers.lastname as teacher_lastname'
            )
            ->whereNull('exams.deleted_at')
            ->orderByDesc('exams.exam_date');
            
        if ($tscId = request()->query('teaching_subject_classe_id')) {
            $query->where('exams.teaching_subject_classe_id', $tscId);
        }
        if ($classeId = request()->query('classe_id')) {
            $query->where('classes.id', $classeId);
        }

        return $this->paginated($query->paginate(max(1, (int) request()->query('per_page', 15))));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreExamRequest $request)
    {
        $exam = Exam::create($request->validated());

        return response()->json([
            'status' => 201,
            'data' => $exam,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Exam $exam)
    {
        return response()->json([
            'status' => 200,
            'data' => $exam,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExamRequest $request, Exam $exam)
    {
        $exam->update($request->validated());

        return response()->json([
            'status' => 200,
            'data' => $exam,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exam $exam)
    {
        $exam->delete();

        return response()->noContent();
    }
}
