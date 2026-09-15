<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Classe extends Model
{
    use HasFactory , SoftDeletes;

    protected $fillable = [
        'name',
        'specialite_id',
        'level_id',
        'school_year_id',
    ];

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function specialite()
    {
        return $this->belongsTo(Specialite::class);
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class);
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'student_classes', 'classe_id', 'student_id');
    }

    public function teachings()
    {
        return $this->hasMany(TeachingSubjectClasse::class, 'classe_id');
    }
}
