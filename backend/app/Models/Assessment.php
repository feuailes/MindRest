<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    public $timestamps = false; // Using created_at only per diagram

    protected $fillable = [
        'user_id',
        'sleep_hours',
        'stress_level',
        'screen_time',
        'mood_rating',
        'risk_level',
        'created_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
