<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
        'game_url',
        'created_at',
    ];

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }
}
