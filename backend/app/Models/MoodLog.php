<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MoodLog extends Model
{
    public $timestamps = false; // Using created_at only per diagram

    protected $fillable = [
        'user_id',
        'mood_score',
        'stress_score',
        'sleep_hours',
        'log_date',
        'created_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
