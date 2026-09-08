<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Room extends Model
{
    use SoftDeletes , HasFactory;

    protected $fillable = [
        'name',
        'capacity',
        'type',
        'availability'
    ];

    public function classSessions()
    {
        return $this->hasMany(ClassSession::class, 'room_id');
    }    
}
