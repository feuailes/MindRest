<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /** POST /api/activity-logs */
    public function store(Request $request)
    {
        $data = $request->validate([
            'activity_type' => 'required|string|max:50',
            'duration_minutes' => 'required|integer|min:1',
            'score' => 'nullable|integer',
            'exercise_id' => 'nullable|exists:exercises,id',
            'game_id' => 'nullable|exists:games,id',
        ]);
        
        $log = ActivityLog::create([
            'user_id' => $request->user()->id,
            'exercise_id' => $data['exercise_id'] ?? null,
            'game_id' => $data['game_id'] ?? null,
            'activity_type' => $data['activity_type'],
            'duration_minutes' => $data['duration_minutes'],
            'score' => $data['score'] ?? null,
        ]);
        
        return response()->json($log, 201);
    }
}
