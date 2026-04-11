<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\JournalEntry;
use App\Models\MoodLog;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /** GET /api/dashboard */
    public function index(Request $request, \App\Services\UserInsightService $insightService)
    {
        $user = $request->user();

        // Last 7 mood logs (kept for existing UI)
        $moodLogs = MoodLog::where('user_id', $user->id)
            ->latest('log_date')
            ->take(7)
            ->get()
            ->map(fn($log) => [
                'date'  => $log->log_date,
                'score' => $log->mood_score,
            ]);

        // Recent journals (3)
        $journals = JournalEntry::where('user_id', $user->id)
            ->latest()
            ->take(3)
            ->get(['id', 'title', 'mood_tag', 'created_at']);

        // Assessment History (last 5)
        $history = Assessment::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        // Latest assessment (already present)
        $latestAssessment = $history->first();

        // Stats
        $streak        = $this->calculateStreak($user->id);
        $avgMoodScore  = MoodLog::where('user_id', $user->id)->avg('mood_score') ?? 0;
        $journalCount  = JournalEntry::where('user_id', $user->id)->count();
        $exerciseCount = \App\Models\ActivityLog::where('user_id', $user->id)->where('activity_type', 'exercise')->count();
        $gameCount     = \App\Models\ActivityLog::where('user_id', $user->id)->where('activity_type', 'game')->count();

        // New Insights Data
        $insights = $insightService->getRecentHistory($user->id);

        return response()->json([
            'user'               => $user->only('id', 'name', 'email'),
            'streak'             => $streak,
            'mood_score'         => round($avgMoodScore, 1),
            'journal_count'      => $journalCount,
            'exercise_count'     => $exerciseCount,
            'game_count'         => $gameCount,
            'mood_trend'         => $moodLogs->reverse()->values(),
            'recent_journals'    => $journals,
            'latest_assessment'  => $latestAssessment,
            'assessment_history' => $history,
            'history'            => $insights // Added the history data
        ]);
    }

    private function calculateStreak(int $userId): int
    {
        $dates = MoodLog::where('user_id', $userId)
            ->orderByDesc('log_date')
            ->pluck('log_date')
            ->map(fn($d) => \Carbon\Carbon::parse($d)->toDateString())
            ->unique()
            ->values();

        if ($dates->isEmpty()) return 0;

        $streak  = 0;
        $current = now()->toDateString();

        foreach ($dates as $date) {
            if ($date === $current || $date === now()->subDays($streak)->toDateString()) {
                $streak++;
            } else {
                break;
            }
        }

        return $streak;
    }
}
