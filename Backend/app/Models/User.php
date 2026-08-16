<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
  use HasApiTokens, HasFactory, Notifiable , SoftDeletes;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */

  protected $fillable = [
    'email',
    'password',
    'firstname',
    'lastname',
    'date_of_birth',
    'last_login_date',
    'gender',
    'blood_type',
    'address',
    'phone',
    'student_parent_id',
    'classe_id',
];

  

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var array<int, string>
   */
  protected $hidden = [
    'password',
    'remember_token',
  ];
  protected $appends = ['role'];

  public function getRoleAttribute()
  {
    return 'student';
  }

  public function parent()
    {
        return $this->belongsTo(StudentParent::class, 'student_parent_id');
    }
  /**
   * The attributes that should be cast.
   *
   * @var array<string, string>
   */
  protected $casts = [
    'date_of_birth' => 'date:Y-m-d',
    'email_verified_at' => 'datetime',
    'password' => 'hashed',
  ];
}