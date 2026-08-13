<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Classe extends Model
{
    use SoftDeletes , HasFactory ;

    protected $fillable = [
        'name',
        'specialite_id',
        'level_id',
        'school_year_id'
    ];
}
