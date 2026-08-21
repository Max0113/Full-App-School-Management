<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, SoftDeletes;

    public const STATUSES = ['pending', 'in_progress', 'completed'];

    /**
     * Forward-only status workflow: pending → in_progress → completed.
     */
    public const TRANSITIONS = [
        'pending' => ['in_progress', 'completed'],
        'in_progress' => ['completed'],
        'completed' => [],
    ];

    protected $fillable = [
        'user_id',
        'amount',
        'date_payment',
        'type_payment',
        'status',
        'admin_id',
    ];

    protected $casts = [
        'amount' => 'float',
        'date_payment' => 'date:Y-m-d',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
