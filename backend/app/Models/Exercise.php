<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'title',
        'description',
        'duration_minutes',
        'difficulty_level',
        'created_at',
    ];

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }
}
