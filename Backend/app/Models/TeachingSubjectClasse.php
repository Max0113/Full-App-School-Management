<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeachingSubjectClasse extends Model
{
    use HasFactory , SoftDeletes;

    protected $fillable = [
        'teacher_id',
        'subject_id',
        'classe_id',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function sessions()
    {
        return $this->hasMany(ClassSession::class, 'teaching_subject_classe_id');
    }

    public function exams()
    {
        return $this->hasMany(Exam::class, 'teaching_subject_classe_id');
    }
}
