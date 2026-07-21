<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentParent extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable, SoftDeletes;

    protected $appends = ['role'];

    public function getRoleAttribute()
    {
        return 'parent';
    }

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
        'created_at',
        'updated_at',
        'deleted_at',
        'remember_token',
        'email_verified_at',
        'last_login_date',
        'password',
    ];
}