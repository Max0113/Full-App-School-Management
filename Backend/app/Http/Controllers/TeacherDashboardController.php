<?php

namespace App\Http\Controllers;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class TeacherDashboardController extends Controller
{
    /**
     * Teacher-scoped dashboard statistics: summary cards + students per class
     * + absences trend + session list (my sessions) + recent activity.
     */
    public function stats(Request $request)
    {
        $teacherId = (int) auth()->id();

        // --- Summary cards ---
        $subjectsTaught = DB::table('teaching_subject_classes')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->select(DB::raw('count(distinct subjects.id) as total'))
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('teaching_subject_classes.deleted_at')
            ->whereNull('subjects.deleted_at')
            ->value('total');

        $classesTaught = DB::table('teaching_subject_classes')
            ->join('classes', 'teaching_subject_classes.classe_id', '=', 'classes.id')
            ->select(DB::raw('count(distinct classes.id) as total'))
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('teaching_subject_classes.deleted_at')
            ->whereNull('classes.deleted_at')
            ->value('total');

        $mySessionTotal = DB::table('class_sessions')
            ->join('teaching_subject_classes', 'class_sessions.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->select(DB::raw('count(class_sessions.id) as total'))
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('class_sessions.deleted_at')
            ->whereNull('teaching_subject_classes.deleted_at')
            ->value('total');

        $myStudentsTotal = DB::table('student_classes')
            ->join('teaching_subject_classes', 'student_classes.classe_id', '=', 'teaching_subject_classes.classe_id')
            ->join('users', 'student_classes.student_id', '=', 'users.id')
            ->select(DB::raw('count(distinct users.id) as total'))
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('student_classes.deleted_at')
            ->whereNull('teaching_subject_classes.deleted_at')
            ->whereNull('users.deleted_at')
            ->value('total');

        // --- Students per class (my classes) ---
        $myClasseIds = DB::table('teaching_subject_classes')
            ->where('teacher_id', '=', $teacherId)
            ->whereNull('deleted_at')
            ->pluck('classe_id');

        $studentsPerClass = DB::table('student_classes')
            ->join('classes', 'student_classes.classe_id', '=', 'classes.id')
            ->join('users', 'student_classes.student_id', '=', 'users.id')
            ->select('classes.name as classe_name', DB::raw('count(distinct users.id) as total'))
            ->whereIn('student_classes.classe_id', $myClasseIds)
            ->whereNull('student_classes.deleted_at')
            ->whereNull('classes.deleted_at')
            ->whereNull('users.deleted_at')
            ->groupBy('classes.id', 'classes.name')
            ->orderByDesc('total')
            ->get();

        // --- Absences of my students (6 last months) ---
        $myStudentIds = DB::table('student_classes')
            ->join('teaching_subject_classes', 'student_classes.classe_id', '=', 'teaching_subject_classes.classe_id')
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('student_classes.deleted_at')
            ->whereNull('teaching_subject_classes.deleted_at')
            ->pluck('student_classes.student_id')
            ->unique()
            ->values();

        $absencesPerMonth = DB::table('absences')
            ->leftJoin('class_sessions', 'absences.class_session_id', '=', 'class_sessions.id')
            ->join('teaching_subject_classes', 'class_sessions.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->select(DB::raw("DATE_FORMAT(COALESCE(absences.date, class_sessions.start_time), '%Y-%m') as month"), DB::raw('count(absences.id) as total'))
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereIn('absences.user_id', $myStudentIds)
            ->whereNull('absences.deleted_at')
            ->where('absences.created_at', '>=', Carbon::now()->subMonths(6)->startOfMonth())
            ->groupBy(DB::raw("DATE_FORMAT(COALESCE(absences.date, class_sessions.start_time), '%Y-%m')"))
            ->orderBy('month')
            ->get();

        $justifiedAbsences = DB::table('absences')
            ->join('class_sessions', 'absences.class_session_id', '=', 'class_sessions.id')
            ->join('teaching_subject_classes', 'class_sessions.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereIn('absences.user_id', $myStudentIds)
            ->where('absences.justified', true)
            ->whereNull('absences.deleted_at')
            ->count();

        $unjustifiedAbsences = DB::table('absences')
            ->join('class_sessions', 'absences.class_session_id', '=', 'class_sessions.id')
            ->join('teaching_subject_classes', 'class_sessions.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereIn('absences.user_id', $myStudentIds)
            ->where('absences.justified', false)
            ->whereNull('absences.deleted_at')
            ->count();

        // --- Summary cards for sessions count & next upcoming session ---
        $today = Carbon::today()->format('Y-m-d');
        $myUpcomingSessions = DB::table('class_sessions')
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
            ->orderByDesc('class_sessions.day')
            ->limit(4)
            ->get();

        // --- Recent exams of my teach subject classes ---
        $recentExams = DB::table('exams')
            ->join('teaching_subject_classes', 'exams.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->join('classes', 'teaching_subject_classes.classe_id', '=', 'classes.id')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->select('exams.id', 'exams.name', 'exams.exam_date', 'exams.type', 'classes.name as classe_name', 'subjects.name as subject_name')
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('exams.deleted_at')
            ->whereNull('teaching_subject_classes.deleted_at')
            ->whereNull('classes.deleted_at')
            ->whereNull('subjects.deleted_at')
            ->orderByDesc('exams.exam_date')
            ->limit(5)
            ->get();

        // --- Recent absences among my students ---
        $recentAbsences = DB::table('absences')
            ->join('class_sessions', 'absences.class_session_id', '=', 'class_sessions.id')
            ->join('teaching_subject_classes', 'class_sessions.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->join('classes', 'teaching_subject_classes.classe_id', '=', 'classes.id')
            ->join('users', 'absences.user_id', '=', 'users.id')
            ->select(
                'absences.id',
                'absences.date',
                'absences.justified',
                'users.firstname as student_firstname',
                'users.lastname as student_lastname',
                'classes.name as classe_name',
                'class_sessions.start_time'
            )
            ->where('teaching_subject_classes.teacher_id', '=', $teacherId)
            ->whereNull('absences.deleted_at')
            ->orderByDesc('absences.created_at')
            ->limit(5)
            ->get();

        return response()->json([
            'subjectsTaught' => (int) $subjectsTaught,
            'classesTaught' => (int) $classesTaught,
            'sessionTotal' => (int) $mySessionTotal,
            'studentTotal' => (int) $myStudentsTotal,
            'studentsPerClass' => $studentsPerClass,
            'absencesPerMonth' => $absencesPerMonth,
            'justifiedAbsences' => (int) $justifiedAbsences,
            'unjustifiedAbsences' => (int) $unjustifiedAbsences,
            'upcomingSessions' => $myUpcomingSessions,
            'recentExams' => $recentExams,
            'recentAbsences' => $recentAbsences,
        ]);
    }
}
