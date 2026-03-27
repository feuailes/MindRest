<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'exercise_id',
        'game_id',
        'activity_type',
        'duration_minutes',
        'created_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
