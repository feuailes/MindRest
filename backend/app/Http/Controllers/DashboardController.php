<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\JournalEntry;
use App\Models\MoodLog;
use App\Models\ActivityLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    /** GET /api/dashboard — returns core data immediately, NO blocking AI call */
    public function index(Request $request, \App\Services\UserInsightService $insightService)
    {
        $user = $request->user();

        // Last 7 mood logs
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

        // Latest assessment
        $latestAssessment = $history->first();

        // Stats
        $streak        = $this->calculateStreak($user->id);
        $avgMoodScore  = MoodLog::where('user_id', $user->id)->avg('mood_score') ?? 0;
        $journalCount  = JournalEntry::where('user_id', $user->id)->count();
        $exerciseCount = ActivityLog::where('user_id', $user->id)->where('activity_type', 'exercise')->count();
        $gameCount     = ActivityLog::where('user_id', $user->id)->where('activity_type', 'game')->count();

        // Digital Health Score — server-side composite
        $digitalHealthScore = $this->calculateHealthScore(
            $latestAssessment?->mood_rating ?? $avgMoodScore,
            $journalCount,
            $exerciseCount,
            $gameCount
        );

        // Insights history (lightweight — no AI call here)
        $insights = $insightService->getRecentHistory($user->id);

        return response()->json([
            'user'                 => $user->only('id', 'name', 'email'),
            'streak'               => $streak,
            'mood_score'           => round($avgMoodScore, 1),
            'journal_count'        => $journalCount,
            'exercise_count'       => $exerciseCount,
            'game_count'           => $gameCount,
            'mood_trend'           => $moodLogs->reverse()->values(),
            'recent_journals'      => $journals,
            'latest_assessment'    => $latestAssessment,
            'assessment_history'   => $history,
            'history'              => $insights,
            'digital_health_score' => $digitalHealthScore,
        ]);
    }

    /**
     * GET /api/dashboard/insight
     * Separate, async endpoint for the AI insight — cached 6h per user.
     */
    public function insight(Request $request, \App\Services\UserInsightService $insightService)
    {
        $user    = $request->user();
        $cacheKey = "ai_insight_{$user->id}";

        $text = Cache::remember($cacheKey, now()->addHours(6), function () use ($user, $insightService) {
            $historyData = $insightService->getRecentHistory($user->id);
            return $insightService->generateAIPersonalizedInsight($historyData);
        });

        return response()->json(['ai_insight' => $text]);
    }

    /**
     * Composite Digital Health Score (0–100), server-side.
     * 70% from mood stability, 30% from engagement activity.
     */
    private function calculateHealthScore(
        float $moodScore,
        int $journals,
        int $exercises,
        int $games
    ): array {
        $stressImpact   = (10 - min($moodScore, 10)) * 7;
        $activityImpact = ($journals * 2) + ($exercises * 5) + ($games * 3);
        $rawScore       = (int) min(max($stressImpact + $activityImpact, 0), 100);

        $label = match(true) {
            $rawScore > 85 => 'Excellent',
            $rawScore > 65 => 'Good',
            $rawScore > 40 => 'Fair',
            default        => 'At Risk',
        };

        $color = match($label) {
            'Excellent' => '#2A9D8F',
            'Good'      => '#4ADE80',
            'Fair'      => '#F4A261',
            default     => '#ef4444',
        };

        return ['score' => $rawScore, 'label' => $label, 'color' => $color];
    }

    /**
     * Count consecutive days the user had ANY activity
     * (mood log, journal entry, exercise, or game).
     */
    private function calculateStreak(int $userId): int
    {
        $moodDates = MoodLog::where('user_id', $userId)
            ->pluck('log_date')
            ->map(fn($d) => Carbon::parse($d)->toDateString());

        $journalDates = JournalEntry::where('user_id', $userId)
            ->pluck('created_at')
            ->map(fn($d) => Carbon::parse($d)->toDateString());

        $activityDates = ActivityLog::where('user_id', $userId)
            ->pluck('created_at')
            ->map(fn($d) => Carbon::parse($d)->toDateString());

        $allDates = $moodDates
            ->merge($journalDates)
            ->merge($activityDates)
            ->unique()
            ->sortDesc()
            ->values();

        if ($allDates->isEmpty()) return 0;

        $streak    = 0;
        $checkDate = Carbon::today();

        foreach ($allDates as $date) {
            if ($date === $checkDate->toDateString()) {
                $streak++;
                $checkDate->subDay();
            } elseif ($date < $checkDate->toDateString()) {
                break; // Gap found — streak ends
            }
        }

        return $streak;
    }
}
