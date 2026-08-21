<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model
{
    use HasFactory , SoftDeletes;

    protected $fillable = [
        'name',
        'specialite_id',
        'facture',
    ];

    public function specialite()
    {
        return $this->belongsTo(Specialite::class);
    }

    public function teachings()
    {
        return $this->hasMany(TeachingSubjectClasse::class, 'subject_id');
    }
}
