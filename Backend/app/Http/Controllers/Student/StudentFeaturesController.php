<?php

namespace App\Http\Controllers\Student;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;


class StudentFeaturesController extends Controller
{
    private function studentId(): int { return (int) auth()->id(); }

    public function dashboard()
    {
        $studentId = $this->studentId();
        $upcoming = $this->examQuery()->whereDate('exams.exam_date', '>=', today())->orderBy('exams.exam_date')->limit(5)->get();
        $recentGrades = $this->gradesQuery()->orderByDesc('grades.updated_at')->limit(5)->get();
        $absenceTotal = DB::table('absences')->where('user_id', $studentId)->whereNull('deleted_at')->count();
        $sessionTotal = DB::table('student_classes')->join('teaching_subject_classes', 'student_classes.classe_id', '=', 'teaching_subject_classes.classe_id')->join('class_sessions', 'teaching_subject_classes.id', '=', 'class_sessions.teaching_subject_classe_id')->where('student_classes.student_id', $studentId)->whereNull('student_classes.deleted_at')->whereNull('teaching_subject_classes.deleted_at')->whereNull('class_sessions.deleted_at')->count();
        $nextSession = $this->sessionsQuery()->orderByRaw("FIELD(class_sessions.day, 'Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche')")->orderBy('class_sessions.start_time')->first();
        return response()->json(['status' => 200, 'data' => ['upcoming_exams' => $upcoming, 'recent_grades' => $recentGrades, 'absence_total' => $absenceTotal, 'attendance_rate' => $sessionTotal ? round((($sessionTotal - $absenceTotal) / $sessionTotal) * 100, 1) : null, 'next_session' => $nextSession, 'notifications' => $upcoming->count() + $recentGrades->count()]]);
    }

    public function grades() { return response()->json(['status' => 200, 'data' => $this->gradesQuery()->orderByDesc('exams.exam_date')->get()]); }
    public function sessions() { return response()->json(['status' => 200, 'data' => $this->sessionsQuery()->orderByRaw("FIELD(class_sessions.day, 'Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche')")->orderBy('class_sessions.start_time')->get()]); }
    public function exams() { return response()->json(['status' => 200, 'data' => $this->examQuery()->orderByDesc('exams.exam_date')->get()]); }

    public function absences()
    {
        $rows = DB::table('absences')->join('class_sessions', 'absences.class_session_id', '=', 'class_sessions.id')->join('teaching_subject_classes', 'class_sessions.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')->where('absences.user_id', $this->studentId())->whereNull('absences.deleted_at')->whereNull('class_sessions.deleted_at')->whereNull('teaching_subject_classes.deleted_at')->whereNull('subjects.deleted_at')->select('absences.id','absences.date','absences.justified','class_sessions.day','class_sessions.start_time','class_sessions.end_time','subjects.name as subject_name')->orderByDesc('absences.date')->get();
        return response()->json(['status' => 200, 'data' => $rows]);
    }

    public function teachers()
    {
        $rows = DB::table('student_classes')->join('teaching_subject_classes', 'student_classes.classe_id', '=', 'teaching_subject_classes.classe_id')->join('teachers', 'teaching_subject_classes.teacher_id', '=', 'teachers.id')->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')->where('student_classes.student_id', $this->studentId())->whereNull('student_classes.deleted_at')->whereNull('teaching_subject_classes.deleted_at')->whereNull('teachers.deleted_at')->select('teachers.id','teachers.firstname','teachers.lastname','teachers.email','teachers.phone','subjects.name as subject_name')->distinct()->orderBy('teachers.lastname')->get();
        return response()->json(['status' => 200, 'data' => $rows]);
    }

    public function schoolInfo()
    {
        $year = DB::table('school_years')->whereNull('deleted_at')->orderByDesc('id')->first(['name']);
        $admins = DB::table('admins')->whereNull('deleted_at')->orderBy('lastname')->get(['firstname','lastname','email','phone','address']);
        return response()->json(['status' => 200, 'data' => ['school_name' => config('app.name', 'Établissement scolaire'), 'school_year' => $year?->name, 'administration' => $admins]]);
    }

    private function gradesQuery()
    {
        return DB::table('grades')->join('exams', 'grades.exam_id', '=', 'exams.id')->join('teaching_subject_classes', 'exams.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')->where('grades.user_id', $this->studentId())->whereNull('grades.deleted_at')->whereNull('exams.deleted_at')->whereNull('teaching_subject_classes.deleted_at')->whereNull('subjects.deleted_at')->select('grades.id','grades.note','grades.appreciation','grades.updated_at','exams.name as exam_name','exams.exam_date','subjects.name as subject_name');
    }

    private function examQuery()
    {
        return DB::table('exams')->join('teaching_subject_classes', 'exams.teaching_subject_classe_id', '=', 'teaching_subject_classes.id')->join('student_classes', 'teaching_subject_classes.classe_id', '=', 'student_classes.classe_id')->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')->leftJoin('grades', function ($join) { $join->on('grades.exam_id', '=', 'exams.id')->where('grades.user_id', '=', $this->studentId())->whereNull('grades.deleted_at'); })->where('student_classes.student_id', $this->studentId())->whereNull('exams.deleted_at')->whereNull('teaching_subject_classes.deleted_at')->whereNull('student_classes.deleted_at')->select('exams.id','exams.name','exams.type','exams.exam_date','subjects.name as subject_name','grades.note','grades.appreciation');
    }

    private function sessionsQuery()
    {
        return DB::table('student_classes')->join('teaching_subject_classes', 'student_classes.classe_id', '=', 'teaching_subject_classes.classe_id')->join('class_sessions', 'teaching_subject_classes.id', '=', 'class_sessions.teaching_subject_classe_id')->join('subjects', 'teaching_subject_classes.subject_id', '=', 'subjects.id')->leftJoin('rooms', 'class_sessions.room_id', '=', 'rooms.id')->where('student_classes.student_id', $this->studentId())->whereNull('student_classes.deleted_at')->whereNull('teaching_subject_classes.deleted_at')->whereNull('class_sessions.deleted_at')->select('class_sessions.id','class_sessions.day','class_sessions.start_time','class_sessions.end_time','subjects.name as subject_name','rooms.name as room_name');
    }
}
