<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClassSession extends Model
{
    use HasFactory , SoftDeletes;

    protected $fillable = [
        'start_time',
        'end_time',
        'teaching_subject_classe_id'
    ];
}
