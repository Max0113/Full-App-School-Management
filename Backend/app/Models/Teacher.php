<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Teacher extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

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
        'password',
    ];

    protected $hidden = [
        'updated_at',
        'deleted_at',
        'remember_token',
        'email_verified_at',
        'last_login_date',
        'password',
    ];

    protected $appends = ['role'];

    protected $casts = [
        'date_of_birth' => 'date:Y-m-d',
        'email_verified_at' => 'datetime',
        'last_login_date' => 'datetime',
        'password' => 'hashed',
    ];

    public function getRoleAttribute()
    {
        return 'teacher';
    }

    public function teachings()
    {
        return $this->hasMany(TeachingSubjectClasse::class);
    }

    public function salaries()
    {
        return $this->hasMany(Salary::class);
    }
}
