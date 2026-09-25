<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ParentFeaturesController extends Controller
{
    private function parentId(): int
    {
        return (int) auth()->id();
    }

    /** Children belonging to the signed-in parent, with their current class. */
    public function children()
    {
        $latestClassMembership = DB::table('student_classes')
            ->selectRaw('student_id, MAX(id) as id')
            ->whereNull('deleted_at')
            ->groupBy('student_id');

        $children = DB::table('users')
            ->leftJoinSub($latestClassMembership, 'latest_class_memberships', function ($join) {
                $join->on('users.id', '=', 'latest_class_memberships.student_id');
            })
            ->leftJoin('student_classes', 'latest_class_memberships.id', '=', 'student_classes.id')
            ->leftJoin('classes', function ($join) {
                $join->on('student_classes.classe_id', '=', 'classes.id')->whereNull('classes.deleted_at');
            })
            ->leftJoin('school_years', function ($join) {
                $join->on('classes.school_year_id', '=', 'school_years.id')->whereNull('school_years.deleted_at');
            })
            ->where('users.student_parent_id', $this->parentId())
            ->whereNull('users.deleted_at')
            ->select('users.id', 'users.firstname', 'users.lastname', 'users.email', 'classes.id as classe_id', 'classes.name as classe_name', 'school_years.name as school_year_name')
            ->orderBy('users.lastname')->orderBy('users.firstname')->get();

        return response()->json(['status' => 200, 'data' => $children]);
    }

    public function dashboard()
    {
        $parentId = $this->parentId();
        $children = DB::table('users')->where('student_parent_id', $parentId)->whereNull('deleted_at')->select('id', 'firstname', 'lastname')->get();
        $childIds = $children->pluck('id');

        $recentGrades = DB::table('grades')
            ->join('users', 'grades.user_id', '=', 'users.id')
            ->join('exams', 'grades.exam_id', '=', 'exams.id')
            ->join('teaching_subject_classes', 'exams.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->whereIn('grades.user_id', $childIds)->whereNull('grades.deleted_at')->whereNull('exams.deleted_at')
            ->select('grades.note', 'grades.appreciation', 'grades.updated_at', 'exams.name as exam_name', 'subjects.name as subject_name', 'users.firstname as student_firstname', 'users.lastname as student_lastname')
            ->orderByDesc('grades.updated_at')->limit(5)->get();

        $upcomingExams = $this->examQuery($parentId)->whereDate('exams.exam_date', '>=', today())->orderBy('exams.exam_date')->limit(5)->get();

        return response()->json(['status' => 200, 'data' => [
            'children' => $children,
            'recent_grades' => $recentGrades,
            'upcoming_exams' => $upcomingExams,
            'notifications' => $upcomingExams->count() + $recentGrades->count(),
        ]]);
    }

    public function grades(Request $request)
    {
        $query = DB::table('grades')
            ->join('users', 'grades.user_id', '=', 'users.id')
            ->join('exams', 'grades.exam_id', '=', 'exams.id')
            ->join('teaching_subject_classes', 'exams.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->leftJoin('classes', 'teaching_subject_classes.classe_id', '=', 'classes.id')
            ->where('users.student_parent_id', $this->parentId())
            ->whereNull('grades.deleted_at')->whereNull('users.deleted_at')->whereNull('exams.deleted_at')
            ->select('grades.id', 'grades.note', 'grades.appreciation', 'exams.name as exam_name', 'exams.type as exam_type', 'exams.exam_date', 'subjects.name as subject_name', 'classes.name as classe_name', 'users.id as student_id', 'users.firstname as student_firstname', 'users.lastname as student_lastname')
            ->orderByDesc('exams.exam_date');
        if ($childId = (int) $request->query('child_id')) $query->where('users.id', $childId);
        return response()->json(['status' => 200, 'data' => $query->get()]);
    }

    public function sessions(Request $request)
    {
        $query = DB::table('student_classes')
            ->join('users', 'student_classes.student_id', '=', 'users.id')
            ->join('classes', 'student_classes.classe_id', '=', 'classes.id')
            ->join('teaching_subject_classes', 'student_classes.classe_id', '=', 'teaching_subject_classes.classe_id')
            ->join('class_sessions', 'teaching_subject_classes.id', '=', 'class_sessions.teaching_subject_classe_id')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->leftJoin('rooms', 'class_sessions.room_id', '=', 'rooms.id')
            ->where('users.student_parent_id', $this->parentId())
            ->whereNull('student_classes.deleted_at')->whereNull('classes.deleted_at')->whereNull('class_sessions.deleted_at')->whereNull('teaching_subject_classes.deleted_at')
            ->select('class_sessions.id', 'class_sessions.day', 'class_sessions.start_time', 'class_sessions.end_time', 'subjects.name as subject_name', 'rooms.name as room_name', 'classes.name as classe_name', 'users.id as student_id', 'users.firstname as student_firstname', 'users.lastname as student_lastname');
        if ($childId = (int) $request->query('child_id')) $query->where('users.id', $childId);
        return response()->json(['status' => 200, 'data' => $query->orderBy('class_sessions.day')->orderBy('class_sessions.start_time')->get()]);
    }

    public function exams(Request $request)
    {
        $query = $this->examQuery($this->parentId());
        if ($childId = (int) $request->query('child_id')) $query->where('users.id', $childId);
        return response()->json(['status' => 200, 'data' => $query->orderByDesc('exams.exam_date')->get()]);
    }

    public function teachers()
    {
        $teachers = DB::table('users')
            ->join('student_classes', 'users.id', '=', 'student_classes.student_id')
            ->join('teaching_subject_classes', 'student_classes.classe_id', '=', 'teaching_subject_classes.classe_id')
            ->join('teachers', 'teaching_subject_classes.teacher_id', '=', 'teachers.id')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->where('users.student_parent_id', $this->parentId())
            ->whereNull('users.deleted_at')->whereNull('student_classes.deleted_at')->whereNull('teaching_subject_classes.deleted_at')->whereNull('teachers.deleted_at')
            ->select('teachers.id', 'teachers.firstname', 'teachers.lastname', 'teachers.email', 'teachers.phone', 'subjects.name as subject_name')
            ->distinct()->orderBy('teachers.lastname')->get();
        return response()->json(['status' => 200, 'data' => $teachers]);
    }

    public function schoolInfo()
    {
        $year = DB::table('school_years')->whereNull('deleted_at')->orderByDesc('id')->first(['name']);
        $admins = DB::table('admins')->whereNull('deleted_at')->orderBy('lastname')->get(['firstname', 'lastname', 'email', 'phone', 'address']);
        return response()->json(['status' => 200, 'data' => ['school_name' => config('app.name', 'Établissement scolaire'), 'school_year' => $year?->name, 'administration' => $admins]]);
    }

    private function examQuery(int $parentId)
    {
        return DB::table('exams')
            ->join('teaching_subject_classes', 'exams.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')
            ->join('student_classes', 'teaching_subject_classes.classe_id', '=', 'student_classes.classe_id')
            ->join('users', 'student_classes.student_id', '=', 'users.id')
            ->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')
            ->leftJoin('grades', function ($join) { $join->on('grades.exam_id', '=', 'exams.id')->on('grades.user_id', '=', 'users.id')->whereNull('grades.deleted_at'); })
            ->where('users.student_parent_id', $parentId)
            ->whereNull('exams.deleted_at')->whereNull('teaching_subject_classes.deleted_at')->whereNull('student_classes.deleted_at')->whereNull('users.deleted_at')
            ->select('exams.id', 'exams.name', 'exams.type', 'exams.exam_date', 'subjects.name as subject_name', 'users.id as student_id', 'users.firstname as student_firstname', 'users.lastname as student_lastname', 'grades.note', 'grades.appreciation');
    }
}
