<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\StudentParent;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CountController extends Controller
{
    public function count()
    {
        $parent = StudentParent::count();
        $student = User::count();
        $teacher = Teacher::count();
        $admin = Admin::count();

        return response()->json([
            'parent' => $parent,
            'student' => $student,
            'teacher' => $teacher,
            'admin' => $admin,
        ]);
    }

    /**
     * Dashboard statistics: cards totals + students per class + absences
     * trend + recent activity.
     */
    public function stats()
    {
        $studentsPerClass = DB::table('users')
            ->join('classes', 'users.classe_id', '=', 'classes.id')
            ->select('classes.name as classe_name', DB::raw('count(users.id) as total'))
            ->whereNull('users.deleted_at')
            ->groupBy('classes.id', 'classes.name')
            ->orderByDesc('total')
            ->get();

        $absencesPerMonth = DB::table('absences')
            ->leftJoin('class_sessions', 'absences.class_session_id', '=', 'class_sessions.id')
            ->select(DB::raw("DATE_FORMAT(COALESCE(absences.date, class_sessions.start_time), '%Y-%m') as month"), DB::raw('count(absences.id) as total'))
            ->whereNull('absences.deleted_at')
            ->where('absences.created_at', '>=', Carbon::now()->subMonths(6)->startOfMonth())
            ->groupBy(DB::raw("DATE_FORMAT(COALESCE(absences.date, class_sessions.start_time), '%Y-%m')"))
            ->orderBy('month')
            ->get();

        $justifiedAbsences = DB::table('absences')
            ->where('justified', true)
            ->whereNull('deleted_at')
            ->count();

        $unjustifiedAbsences = DB::table('absences')
            ->where('justified', false)
            ->whereNull('deleted_at')
            ->count();

        $recentStudents = DB::table('users')
            ->leftJoin('classes', 'users.classe_id', '=', 'classes.id')
            ->select('users.id', 'users.firstname', 'users.lastname', 'users.created_at', 'classes.name as classe_name')
            ->whereNull('users.deleted_at')
            ->orderByDesc('users.created_at')
            ->limit(5)
            ->get();

        $recentExams = DB::table('exams')
            ->join('teaching_subject_classes', 'exams.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->join('classes', 'teaching_subject_classes.classe_id', '=', 'classes.id')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->select('exams.id', 'exams.name', 'exams.exam_date', 'exams.type', 'classes.name as classe_name', 'subjects.name as subject_name')
            ->whereNull('exams.deleted_at')
            ->whereNull('teaching_subject_classes.deleted_at')
            ->whereNull('classes.deleted_at')
            ->whereNull('subjects.deleted_at')
            ->orderByDesc('exams.exam_date')
            ->limit(5)
            ->get();

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
            ->whereNull('absences.deleted_at')
            ->orderByDesc('absences.created_at')
            ->limit(5)
            ->get();

        return response()->json([
            'parent' => StudentParent::count(),
            'student' => User::count(),
            'teacher' => Teacher::count(),
            'admin' => Admin::count(),
            'studentsPerClass' => $studentsPerClass,
            'absencesPerMonth' => $absencesPerMonth,
            'justifiedAbsences' => $justifiedAbsences,
            'unjustifiedAbsences' => $unjustifiedAbsences,
            'recentStudents' => $recentStudents,
            'recentExams' => $recentExams,
            'recentAbsences' => $recentAbsences,
        ]);
    }
}
