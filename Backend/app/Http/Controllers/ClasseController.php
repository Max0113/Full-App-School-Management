<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClasseRequest;
use App\Http\Requests\UpdateClasseRequest;
use Illuminate\Http\Request;
use App\Models\Classe;
use Illuminate\Support\Facades\DB;

class ClasseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $results = Classe::with(['level', 'specialite', 'schoolYear'])
            ->whereHas('level', function ($q) {
                $q->whereNull('deleted_at');
            })
            ->whereHas('specialite', function ($q) {
                $q->whereNull('deleted_at');
            })
            ->whereHas('schoolYear', function ($q) {
                $q->whereNull('deleted_at');
            })
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $results,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClasseRequest $request)
    {
        $data = Classe::create($request->validated());

        return response()->json([
            'status' => 201,
            'data' => $data,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Classe $classe)
    {
        return response()->json([
            'status' => 200,
            'data' => $classe,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClasseRequest $request, $id)
    {
        $classe = Classe::findOrFail($id);

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
        $classe = Classe::find($id);

        if (! $classe) {
            return response()->json([
                'status' => 404,
                'message' => 'Classe not found',
            ], 404);
        }

        $classe->delete();

        return response()->noContent();
    }

    public function students(Request $request)
    {
        $teacherId = (int) auth()->id();

        $query = DB::table('student_classes')
            ->join('teaching_subject_classes', 'student_classes.classe_id', '=', 'teaching_subject_classes.classe_id')
            ->join('classes', 'student_classes.classe_id', '=', 'classes.id')
            ->join('users', 'student_classes.student_id', '=', 'users.id')
            ->join('school_years', 'classes.school_year_id', '=', 'school_years.id')
            ->select(
                'users.id',
                'users.firstname as student_firstname',
                'users.lastname as student_lastname',
                'users.email as student_email',
                'classes.name as classe_name',
                'student_classes.classe_id',
                'student_classes.updated_at',
                'school_years.name as school_year_name',
            )
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('student_classes.deleted_at')
            ->whereNull('teaching_subject_classes.deleted_at')
            ->whereNull('classes.deleted_at')
            ->whereNull('users.deleted_at')
            ->distinct()
            ->orderBy('users.lastname')
            ->orderBy('users.firstname');

        if ($classeId = (int) $request->query('classe_id')) {
            $query->where('student_classes.classe_id', '=', $classeId);
        }
        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(static function ($q) use ($search) {
                $q->where('users.firstname', 'like', "%{$search}%")
                    ->orWhere('users.lastname', 'like', "%{$search}%");
            });
        }

        $students = $query->paginate(max(1, (int) $request->query('per_page', 25)));

        return response()->json([
            'status' => 200,
            'data' => $students,
        ]);
    }

    /**
     * My classes + subjects (one row per teaching assignment), with counts:
     * student_total + session_total per assignment. Ownership = teacher_id.
     */
    public function classes(Request $request)
    {
        $teacherId = (int) auth()->id();

        $rows = DB::table('teaching_subject_classes')
            ->join('classes', 'teaching_subject_classes.classe_id', '=', 'classes.id')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->join('specialites', 'subjects.specialite_id', '=', 'specialites.id')
            ->join('school_years', 'classes.school_year_id', '=', 'school_years.id')
            ->select(
                'teaching_subject_classes.id',
                'teaching_subject_classes.classe_id',
                'teaching_subject_classes.subject_id',
                'teaching_subject_classes.updated_at',
                'specialites.name as specialites_name',
                'classes.name as classe_name',
                'subjects.name as subject_name',
                'school_years.name as school_year_name',
            )
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('teaching_subject_classes.deleted_at')
            ->whereNull('classes.deleted_at')
            ->whereNull('subjects.deleted_at')
            ->orderBy('classes.name')
            ->orderBy('subjects.name')
            ->get();

        $rows = $rows->map(static function ($row) use ($teacherId) {
            $studentTotal = DB::table('student_classes')
                ->join('teaching_subject_classes', 'student_classes.classe_id', '=', 'teaching_subject_classes.classe_id')
                ->join('users', 'student_classes.student_id', '=', 'users.id')
                ->select(DB::raw('count(distinct users.id) as total'))
                ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
                ->where('teaching_subject_classes.classe_id', '=', $row->classe_id)
                ->whereNull('student_classes.deleted_at')
                ->whereNull('teaching_subject_classes.deleted_at')
                ->whereNull('users.deleted_at')
                ->value('total');

            $sessionTotal = DB::table('class_sessions')
                ->join('teaching_subject_classes', 'class_sessions.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
                ->select(DB::raw('count(class_sessions.id) as total'))
                ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
                ->where('teaching_subject_classes.classe_id', '=', $row->classe_id)
                ->where('teaching_subject_classes.subject_id', '=', $row->subject_id)
                ->whereNull('class_sessions.deleted_at')
                ->whereNull('teaching_subject_classes.deleted_at')
                ->value('total');

            return [
                'id' => $row->id,
                'classe_id' => (int) $row->classe_id,
                'classe_name' => $row->classe_name,
                'subject_id' => (int) $row->subject_id,
                'subject_name' => $row->subject_name,
                'student_total' => (int) $studentTotal,
                'session_total' => (int) $sessionTotal,
                'specialites_name' => $row->specialites_name,
                'school_year_name' => $row->school_year_name,
                'updated_at' => $row->updated_at,
            ];
        });

        return response()->json([
            'status' => 200,
            'data' => $rows,
        ]);
    }
}
