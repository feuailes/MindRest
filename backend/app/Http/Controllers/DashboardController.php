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

        // 1. Stress Trend & History
        $history = Assessment::where('user_id', $user->id)
            ->latest()
            ->take(15)
            ->get();

        $deepHistory = $history->take(10)->map(function($a) use ($user) {
            $date = Carbon::parse($a->created_at ?? now())->toDateString();
            $a->activities = ActivityLog::where('user_id', $user->id)
                ->whereDate('created_at', $date)
                ->with(['game', 'exercise'])
                ->get()
                ->map(fn($act) => [
                    'type' => $act->activity_type,
                    'name' => ($act->activity_type === 'game' ? $act->game?->name : $act->exercise?->name) ?? 'Unidentified',
                    'duration' => $act->duration_minutes,
                ]);

            $journal = JournalEntry::where('user_id', $user->id)
                ->whereDate('created_at', $date)
                ->latest()
                ->first();
            $a->journals_count = $journal ? 1 : 0;
            $a->mood_tag = $journal?->mood_tag;
            return $a;
        });

        // 2. Weekly Summary Comparison
        $thisWeekStart = Carbon::now()->startOfWeek();
        $lastWeekStart = Carbon::now()->subWeek()->startOfWeek();
        $lastWeekEnd   = Carbon::now()->subWeek()->endOfWeek();

        $thisWeekAvg = Assessment::where('user_id', $user->id)->where('created_at', '>=', $thisWeekStart)->avg('mood_rating') ?? 0;
        $lastWeekAvg = Assessment::where('user_id', $user->id)->whereBetween('created_at', [$lastWeekStart, $lastWeekEnd])->avg('mood_rating') ?? 0;
        $improvement = $lastWeekAvg > 0 ? (($thisWeekAvg - $lastWeekAvg) / $lastWeekAvg) * 100 : 0;

        $weeklyReview = [
            'avg_score' => round($thisWeekAvg, 1),
            'improvement_pct' => round($improvement, 1),
            'total_focus_minutes' => ActivityLog::where('user_id', $user->id)->where('created_at', '>=', $thisWeekStart)->sum('duration_minutes'),
            'top_mood' => JournalEntry::where('user_id', $user->id)->where('created_at', '>=', $thisWeekStart)->selectRaw('mood_tag, count(*) as count')->groupBy('mood_tag')->orderByDesc('count')->first()?->mood_tag ?? 'Stable',
        ];

        // 3. Analytics: Sleep vs Mood Correlation
        $sleepMoodData = $history->map(fn($a) => ['x' => (float)$a->sleep_hours, 'y' => (int)$a->mood_rating]);

        // 4. Analytics: Recovery Impact (Active vs Neutral days)
        $activeAverages = $deepHistory->filter(fn($h) => count($h->activities) > 0 || $h->journals_count > 0)->avg('mood_rating') ?? 0;
        $neutralAverages = $deepHistory->filter(fn($h) => count($h->activities) === 0 && $h->journals_count === 0)->avg('mood_rating') ?? 0;

        $recoveryImpact = [
            'activity_avg' => round($activeAverages, 1),
            'neutral_avg'  => round($neutralAverages, 1),
        ];

        // 5. Overall Stats
        $avgMood = $history->avg('mood_rating') ?? 0;
        $streak  = $this->calculateStreak($user->id);

        $latest = $history->first();
        $healthScore = $this->calculateHealthScore(
            $latest?->mood_rating ?? $avgMood,
            $latest?->stress_level ?? 5,
            $latest?->sleep_hours ?? 5,
            $latest?->screen_time ?? 5,
            JournalEntry::where('user_id', $user->id)->count(),
            ActivityLog::where('user_id', $user->id)->where('activity_type', 'exercise')->count(),
            ActivityLog::where('user_id', $user->id)->where('activity_type', 'game')->count()
        );

        return response()->json([
            'user'                 => $user->only('id', 'name'),
            'streak'               => $streak,
            'mood_history'         => $history->map(fn($h) => ['date' => $h->created_at, 'score' => $h->mood_rating])->reverse()->values(),
            'assessment_history'   => $deepHistory,
            'weekly_review'        => $weeklyReview,
            'sleep_mood_data'      => $sleepMoodData,
            'recovery_impact'      => $recoveryImpact,
            'digital_health_score' => $healthScore,
            'break_prediction'     => $insightService->predictOptimalBreak($user->id),
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
        float $mood,
        float $stress,
        float $sleep,
        float $screen,
        int $journals,
        int $exercises,
        int $games
    ): array {
        // All metrics are 1 (Safe) to 10 (Exhaustion/Worst)
        // Composite exhaustion (higher is worse)
        $exhaustion = ($mood + $stress + $sleep + $screen) / 4;
        
        // Resilience factor: Activity reduces exhaustion impact slightly
        $activityBonus = ($journals * 0.5) + ($exercises * 1.5) + ($games * 1);
        
        // Final health score: 100 is perfect wellness, 0 is full exhaustion
        // Inverse the exhaustion (10 -> 0)
        $rawScore = (int)((10 - $exhaustion) * 10) + $activityBonus;
        $rawScore = (int) min(max($rawScore, 0), 100);

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
