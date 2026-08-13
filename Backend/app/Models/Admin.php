<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Override;

class Admin extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable , SoftDeletes;

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

  public function getRoleAttribute()
  {
    return 'admin';
  }

}