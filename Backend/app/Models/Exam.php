<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Exam extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'exam_date',
        'teaching_subject_classe_id',
    ];

    protected $casts = [
        'exam_date' => 'date:Y-m-d',
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

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }
}
