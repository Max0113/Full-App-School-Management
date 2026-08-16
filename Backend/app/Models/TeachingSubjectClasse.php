<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeachingSubjectClasse extends Model
{
    use SoftDeletes , HasFactory ;

    protected $fillable = [
        'teacher_id',
        'subject_id',
        'classe_id'
    ];
}
