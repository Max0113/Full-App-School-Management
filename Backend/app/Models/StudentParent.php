<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentParent extends Model
{
    use HasFactory ;

    protected $fillable = [
        'firstname',
        'lastname',
        'date_of_birth',
        'last_login_date',
        'gender',
        'blood_type',
        'address',
        'phone',
        'email',
        'password'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
        'remember_token',
        'email_verified_at',
        'last_login_date',
        'password'
    ];
}
