<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalEntry extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'mood_tag',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
