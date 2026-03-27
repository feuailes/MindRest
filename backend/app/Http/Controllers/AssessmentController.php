<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\MoodLog;
use Illuminate\Http\Request;

class AssessmentController extends Controller
{
    /** GET /api/assessment — list user's assessments */
    public function index(Request $request)
    {
        $assessments = Assessment::where('user_id', $request->user()->id)
            ->latest()
            ->take(10)
            ->get();

        return response()->json($assessments);
    }

    /** POST /api/assessment — submit a new assessment */
    public function store(Request $request)
    {
        $data = $request->validate([
            'sleep_hours'  => 'required|numeric|min:0|max:24',
            'stress_level' => 'required|integer|min:1|max:10',
            'screen_time'  => 'required|numeric|min:0|max:24',
            'mood_rating'  => 'required|integer|min:1|max:10',
        ]);

        // Simple risk calculation (mirrors old Python ML logic approximately)
        $risk = $this->calculateRisk($data['sleep_hours'], $data['stress_level'], $data['screen_time']);

        $assessment = Assessment::create([
            'user_id'      => $request->user()->id,
            'sleep_hours'  => $data['sleep_hours'],
            'stress_level' => $data['stress_level'],
            'screen_time'  => $data['screen_time'],
            'mood_rating'  => $data['mood_rating'],
            'risk_level'   => $this->riskLabel($risk),
        ]);

        // Log mood
        MoodLog::create([
            'user_id'      => $request->user()->id,
            'mood_score'   => $data['mood_rating'],
            'stress_score' => $data['stress_level'],
            'sleep_hours'  => $data['sleep_hours'],
            'log_date'     => now()->toDateString(),
        ]);

        return response()->json([
            'assessment' => $assessment,
            'risk_label' => $this->riskLabel($risk),
        ], 201);
    }

    private function calculateRisk($sleep, $stress, $screen): int
    {
        $score = 0;
        if ($sleep < 6)     $score += 2;
        if ($sleep < 7)     $score += 1;
        if ($stress >= 7)   $score += 2;
        if ($stress >= 5)   $score += 1;
        if ($screen > 8)    $score += 2;
        if ($screen > 6)    $score += 1;
        // 0-2 = low, 3-5 = moderate, 6+ = high
        if ($score >= 6) return 3;
        if ($score >= 3) return 2;
        return 1;
    }


    private function riskLabel(int $risk): string
    {
        return match ($risk) {
            3 => 'High',
            2 => 'Moderate',
            default => 'Low',
        };
    }
}
