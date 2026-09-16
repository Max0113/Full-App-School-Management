<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Exam;
use App\Models\Grade;

use function auth;

class TeacherFeaturesController extends Controller
{
    /**
     * My students: students of classes I teach (ownership verified server-side,
     * never trusting any teacher_id sent by the frontend).
     * Filters: ?classe_id=  ?search=  ?per_page=
     */
    public function students(Request $request)
    {
        $teacherId = (int) auth()->id();

        $query = DB::table('student_classes')
            ->join('teaching_subject_classes', 'student_classes.classe_id', '=', 'teaching_subject_classes.classe_id')
            ->join('classes', 'student_classes.classe_id', '=', 'classes.id')
            ->join('users', 'student_classes.student_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.firstname as student_firstname',
                'users.lastname as student_lastname',
                'users.email as student_email',
                'classes.name as classe_name',
                'student_classes.classe_id'
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
            ->select(
                'teaching_subject_classes.id',
                'teaching_subject_classes.classe_id',
                'teaching_subject_classes.subject_id',
                'classes.name as classe_name',
                'subjects.name as subject_name'
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
            ];
        });

        return response()->json([
            'status' => 200,
            'data' => $rows,
        ]);
    }

    /**
     * My session timetable, grouped day by day (Lundi -> Dimanche).
     * Ownership = teaching_subject_classes.teacher_id.
     */
    public function sessions(Request $request)
    {
        $teacherId = (int) auth()->id();

        $dayOrder = '
            CASE teaching_subject_classes.day
                WHEN "Lundi" THEN 1
                WHEN "Mardi" THEN 2
                WHEN "Mercredi" THEN 3
                WHEN "Jeudi" THEN 4
                WHEN "Vendredi" THEN 5
                WHEN "Samedi" THEN 6
                WHEN "Dimanche" THEN 7
                ELSE 8
            END
        ';

        $sessions = DB::table('class_sessions')
            ->join('teaching_subject_classes', 'class_sessions.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->join('classes', 'teaching_subject_classes.classe_id', '=', 'classes.id')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->join('rooms', 'class_sessions.room_id', '=', 'rooms.id')
            ->select(
                'class_sessions.id',
                'class_sessions.day',
                'class_sessions.start_time',
                'class_sessions.end_time',
                'classes.name as classe_name',
                'subjects.name as subject_name',
                'rooms.name as room_name'
            )
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('class_sessions.deleted_at')
            ->whereNull('teaching_subject_classes.deleted_at')
            ->whereNull('classes.deleted_at')
            ->whereNull('subjects.deleted_at')
            ->whereNull('rooms.deleted_at')
            ->orderByRaw($dayOrder)
            ->orderBy('class_sessions.start_time')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $sessions,
        ]);
    }

    /**
     * Students present in the class of ONE of my sessions (attendance target).
     * Ownership verified on the session -> assignment -> teacher.
     */
    public function sessionStudents(Request $request, $sessionId)
    {
        $teacherId = (int) auth()->id();

        $session = DB::table('class_sessions')
            ->join('teaching_subject_classes', 'class_sessions.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->select('class_sessions.*', 'teaching_subject_classes.classe_id')
            ->where('class_sessions.id', '=', (int) $sessionId)
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('class_sessions.deleted_at')
            ->whereNull('teaching_subject_classes.deleted_at')
            ->first();

        if (! $session) {
            return response()->json([
                'status' => 404,
                'message' => 'Séance introuvable ou non autorisée.',
            ], 404);
        }

        $students = DB::table('student_classes')
            ->join('users', 'student_classes.student_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.firstname as student_firstname',
                'users.lastname as student_lastname'
            )
            ->where('student_classes.classe_id', '=', $session->classe_id)
            ->whereNull('student_classes.deleted_at')
            ->whereNull('users.deleted_at')
            ->orderBy('users.lastname')
            ->orderBy('users.firstname')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => [
                'session' => $session,
                'students' => $students,
            ],
        ]);
    }

    /**
     * Attendance: sessions grouped per day for the attendance screen.
     */
    public function attendance(Request $request)
    {
        return $this->sessions($request);
    }

    /**
     * Record absences for students of MY session (ownership verified).
     */
    public function attendanceBulk(Request $request)
    {
        $teacherId = (int) auth()->id();

        $validated = $request->validate([
            'class_session_id' => 'required|integer|exists:class_sessions,id',
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'required|integer|distinct|exists:users,id',
        ]);

        $ownsSession = DB::table('class_sessions')
            ->join('teaching_subject_classes', 'class_sessions.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->where('class_sessions.id', '=', (int) $validated['class_session_id'])
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('class_sessions.deleted_at')
            ->whereNull('teaching_subject_classes.deleted_at')
            ->exists();

        if (! $ownsSession) {
            return response()->json([
                'status' => 403,
                'message' => "Vous ne pouvez pas pointer une séance qui ne vous appartient pas.",
            ], 403);
        }

        $count = 0;
        foreach ($validated['user_ids'] as $userId) {
            DB::table('absences')->insertOrIgnore([
                'class_session_id' => (int) $validated['class_session_id'],
                'user_id' => (int) $userId,
                'justified' => false,
                'date' => Carbon::today()->toDateString(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $count++;
        }

        return response()->json([
            'status' => 201,
            'message' => "{$count} absence(s) enregistrée(s).",
            'data' => [
                'class_session_id' => (int) $validated['class_session_id'],
                'count' => $count,
            ],
        ], 201);
    }

    /**
     * Exams of MY assignments, optionally filtered by teaching_subject_classe_id.
     */
    public function exams(Request $request)
    {
        $teacherId = (int) auth()->id();

        $query = DB::table('exams')
            ->join('teaching_subject_classes', 'exams.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->join('classes', 'teaching_subject_classes.classe_id', '=', 'classes.id')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->select(
                'exams.id',
                'exams.name',
                'exams.type',
                'exams.exam_date',
                'exams.teaching_subject_classe_id',
                'classes.name as classe_name',
                'subjects.name as subject_name',
                'teaching_subject_classes.classe_id as selected_classe_id'
            )
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('exams.deleted_at')
            ->whereNull('teaching_subject_classes.deleted_at')
            ->whereNull('classes.deleted_at')
            ->whereNull('subjects.deleted_at')
            ->orderByDesc('exams.exam_date');

        if ($assignmentId = (int) $request->query('teaching_subject_classe_id')) {
            $query->where('exams.teaching_subject_classe_id', '=', $assignmentId);
        }

        $exams = $query->paginate(max(1, (int) $request->query('per_page', 25)));

        return response()->json([
            'status' => 200,
            'data' => $exams,
        ]);
    }

    /**
     * Create an exam for one of MY assignments (ownership verified).
     */
    public function storeExam(Request $request)
    {
        $teacherId = (int) auth()->id();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:written,oral,practical',
            'exam_date' => 'required|date',
            'teaching_subject_classe_id' => 'required|integer|exists:teaching_subject_classes,id',
        ]);

        $ownsAssignment = DB::table('teaching_subject_classes')
            ->where('id', '=', (int) $validated['teaching_subject_classe_id'])
            ->where('teacher_id', '=', $teacherId)
            ->whereNull('deleted_at')
            ->exists();

        if (! $ownsAssignment) {
            return response()->json([
                'status' => 403,
                'message' => "Vous ne pouvez pas créer un examen sur un enseignement qui ne vous appartient pas.",
            ], 403);
        }

        $exam = Exam::create($validated);

        return response()->json([
            'status' => 201,
            'data' => $exam,
        ], 201);
    }

    /**
     * Update one of my exams (ownership verified).
     */
    public function updateExam(Request $request, $examId)
    {
        $teacherId = (int) auth()->id();

        $exam = DB::table('exams')
            ->join('teaching_subject_classes', 'exams.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->select('exams.*')
            ->where('exams.id', '=', (int) $examId)
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('exams.deleted_at')
            ->whereNull('teaching_subject_classes.deleted_at')
            ->first();

        if (! $exam) {
            return response()->json([
                'status' => 404,
                'message' => 'Examen introuvable ou non autorisé.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:written,oral,practical',
            'exam_date' => 'sometimes|date',
            'teaching_subject_classe_id' => 'sometimes|integer|exists:teaching_subject_classes,id',
        ]);

        if (isset($validated['teaching_subject_classe_id'])) {
            $ownsNew = DB::table('teaching_subject_classes')
                ->where('id', '=', (int) $validated['teaching_subject_classe_id'])
                ->where('teacher_id', '=', $teacherId)
                ->whereNull('deleted_at')
                ->exists();

            if (! $ownsNew) {
                return response()->json([
                    'status' => 403,
                    'message' => "Vous ne pouvez pas déplacer l'examen vers un enseignement qui ne vous appartient pas.",
                ], 403);
            }
        }

        DB::table('exams')->where('id', '=', (int) $examId)->update(
            array_merge($validated, ['updated_at' => now()])
        );

        $fresh = DB::table('exams')
            ->join('teaching_subject_classes', 'exams.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->select('exams.*')
            ->where('exams.id', '=', (int) $examId)
            ->first();

        return response()->json([
            'status' => 200,
            'data' => $fresh,
        ]);
    }

    /**
     * Delete one of my exams (ownership verified).
     */
    public function destroyExam($examId)
    {
        $teacherId = (int) auth()->id();

        $ownsExam = DB::table('exams')
            ->join('teaching_subject_classes', 'exams.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->where('exams.id', '=', (int) $examId)
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('exams.deleted_at')
            ->whereNull('teaching_subject_classes.deleted_at')
            ->exists();

        if (! $ownsExam) {
            return response()->json([
                'status' => 403,
                'message' => "Vous ne pouvez pas supprimer un examen qui ne vous appartient pas.",
            ], 403);
        }

        DB::table('exams')->where('id', '=', (int) $examId)->update([
            'deleted_at' => now(),
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Examen supprimé.',
        ]);
    }

    /**
     * Students of the class of one of my exams (for entering grades).
     */
    public function examStudents(Request $request, $examId)
    {
        $teacherId = (int) auth()->id();

        $exam = DB::table('exams')
            ->join('teaching_subject_classes', 'exams.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->select('exams.*', 'teaching_subject_classes.classe_id')
            ->where('exams.id', '=', (int) $examId)
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('exams.deleted_at')
            ->whereNull('teaching_subject_classes.deleted_at')
            ->first();

        if (! $exam) {
            return response()->json([
                'status' => 404,
                'message' => 'Examen introuvable ou non autorisé.',
            ], 404);
        }

        $students = DB::table('student_classes')
            ->join('users', 'student_classes.student_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.firstname as student_firstname',
                'users.lastname as student_lastname',
                'users.email as student_email'
            )
            ->where('student_classes.classe_id', '=', $exam->classe_id)
            ->whereNull('student_classes.deleted_at')
            ->whereNull('users.deleted_at')
            ->orderBy('users.lastname')
            ->orderBy('users.firstname')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => [
                'exam' => $exam,
                'students' => $students,
            ],
        ]);
    }

    /**
     * My students' grades, optionally filtered by exam_id.
     */
    public function grades(Request $request)
    {
        $teacherId = (int) auth()->id();

        $query = DB::table('grades')
            ->join('exams', 'grades.exam_id', '=', 'exams.id')
            ->join('teaching_subject_classes', 'exams.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->join('classes', 'teaching_subject_classes.classe_id', '=', 'classes.id')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->join('users', 'grades.user_id', '=', 'users.id')
            ->select(
                'grades.*',
                'exams.name as exam_name',
                'exams.type as exam_type',
                'classes.name as classe_name',
                'subjects.name as subject_name',
                'users.firstname as student_firstname',
                'users.lastname as student_lastname'
            )
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('grades.deleted_at')
            ->whereNull('exams.deleted_at')
            ->whereNull('teaching_subject_classes.deleted_at')
            ->whereNull('classes.deleted_at')
            ->whereNull('subjects.deleted_at')
            ->whereNull('users.deleted_at')
            ->orderByDesc('grades.id');

        if ($examId = (int) $request->query('exam_id')) {
            $query->where('grades.exam_id', '=', $examId);
        }

        $grades = $query->paginate(max(1, (int) $request->query('per_page', 25)));

        return response()->json([
            'status' => 200,
            'data' => $grades,
        ]);
    }

    /**
     * Bulk-create grades for one of MY exams (ownership verified via exam).
     */
    public function gradeBulk(Request $request)
    {
        $teacherId = (int) auth()->id();

        $validated = $request->validate([
            'exam_id' => 'required|integer|exists:exams,id',
            'grades' => 'required|array|min:1',
            'grades.*.user_id' => 'required|integer|distinct|exists:users,id',
            'grades.*.note' => 'required|numeric|between:0,20',
            'grades.*.appreciation' => 'nullable|string|max:255',
        ]);

        $ownsExam = DB::table('exams')
            ->join('teaching_subject_classes', 'exams.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->where('exams.id', '=', (int) $validated['exam_id'])
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('exams.deleted_at')
            ->whereNull('teaching_subject_classes.deleted_at')
            ->exists();

        if (! $ownsExam) {
            return response()->json([
                'status' => 403,
                'message' => "Vous ne pouvez pas noter un examen qui ne vous appartient pas.",
            ], 403);
        }

        $now = now();
        $inserted = 0;
        foreach ($validated['grades'] as $gradeRow) {
            Grade::updateOrCreate(
                [
                    'exam_id' => (int) $validated['exam_id'],
                    'user_id' => (int) $gradeRow['user_id'],
                ],
                [
                    'note' => (float) $gradeRow['note'],
                    'appreciation' => $gradeRow['appreciation'] ?? null,
                    'updated_at' => $now,
                ]
            );
            $inserted++;
        }

        return response()->json([
            'status' => 200,
            'message' => "{$inserted} note(s) enregistrée(s).",
            'data' => [
                'exam_id' => (int) $validated['exam_id'],
                'count' => $inserted,
            ],
        ]);
    }

    /**
     * Parents of my students, via student_parents -> users.student_parent_id.
     */
    public function parents(Request $request)
    {
        $teacherId = (int) auth()->id();

        $parents = DB::table('users as students')
            ->join('student_classes', 'students.id', '=', 'student_classes.student_id')
            ->join('teaching_subject_classes', 'student_classes.classe_id', '=', 'teaching_subject_classes.classe_id')
            ->join('student_parents', 'students.student_parent_id', '=', 'student_parents.id')
            ->select(
                'student_parents.id',
                'student_parents.firstname as parent_firstname',
                'student_parents.lastname as parent_lastname',
                'student_parents.email as parent_email',
                'student_parents.phone as parent_phone',
                'students.firstname as student_firstname',
                'students.lastname as student_lastname'
            )
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('student_classes.deleted_at')
            ->whereNull('teaching_subject_classes.deleted_at')
            ->whereNull('student_parents.deleted_at')
            ->whereNull('students.deleted_at')
            ->distinct()
            ->orderBy('student_parents.lastname');

        if ($search = trim((string) $request->query('search', ''))) {
            $parents->where(static function ($q) use ($search) {
                $q->where('student_parents.firstname', 'like', "%{$search}%")
                    ->orWhere('student_parents.lastname', 'like', "%{$search}%");
            });
        }

        $result = $parents->paginate(max(1, (int) $request->query('per_page', 25)));

        return response()->json([
            'status' => 200,
            'data' => $result,
        ]);
    }
}
