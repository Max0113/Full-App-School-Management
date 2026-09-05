<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClassSession extends Model
{
    use HasFactory , SoftDeletes;

    protected $fillable = [
        'day',
        'start_time',
        'end_time',
        'teaching_subject_classe_id',
    ];

    public function teachingSubjectClasse()
    {
        return $this->belongsTo(TeachingSubjectClasse::class, 'teaching_subject_classe_id');
    }

    public function classe()
    {
        return $this->hasOneThrough(
            Classe::class,
            TeachingSubjectClasse::class,
            'id',
            'id',
            'teaching_subject_classe_id',
            'classe_id',
        );
    }

    public function absences()
    {
        return $this->hasMany(Absence::class, 'class_session_id');
    }
}
