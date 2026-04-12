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

        // Last 7 mood logs for the sparkline
        $moodLogs = MoodLog::where('user_id', $user->id)
            ->latest('log_date')
            ->take(7)
            ->get()
            ->map(fn($log) => [
                'date'  => $log->log_date,
                'score' => $log->mood_score,
            ]);

        // Assessment History with Deep Details
        $history = Assessment::where('user_id', $user->id)
            ->latest()
            ->take(10)
            ->map(function($a) use ($user) {
                $date = Carbon::parse($a->created_at ?? now())->toDateString();
                
                // Fetch specific activities for this day
                $a->activities = ActivityLog::where('user_id', $user->id)
                    ->whereDate('created_at', $date)
                    ->with(['game', 'exercise'])
                    ->get()
                    ->map(fn($act) => [
                        'type' => $act->activity_type,
                        'name' => ($act->activity_type === 'game' ? $act->game?->name : $act->exercise?->name) ?? 'Unidentified',
                        'duration' => $act->duration_minutes,
                        'score' => $act->score
                    ]);

                // Daily Counts for the summary pills
                $a->games_count = $a->activities->where('type', 'game')->count();
                $a->exercises_count = $a->activities->where('type', 'exercise')->count();
                
                // Journal Vibes
                $journal = JournalEntry::where('user_id', $user->id)
                    ->whereDate('created_at', $date)
                    ->latest()
                    ->first();
                $a->journals_count = $journal ? 1 : 0;
                $a->mood_tag = $journal?->mood_tag;
                
                return $a;
            });

        // Weekly Review (This Week vs Last Week)
        $thisWeekStart = Carbon::now()->startOfWeek();
        $lastWeekStart = Carbon::now()->subWeek()->startOfWeek();
        $lastWeekEnd   = Carbon::now()->subWeek()->endOfWeek();

        $thisWeekScores = Assessment::where('user_id', $user->id)->where('created_at', '>=', $thisWeekStart)->pluck('mood_rating');
        $lastWeekScores = Assessment::where('user_id', $user->id)->whereBetween('created_at', [$lastWeekStart, $lastWeekEnd])->pluck('mood_rating');

        $thisWeekAvg = $thisWeekScores->avg() ?? 0;
        $lastWeekAvg = $lastWeekScores->avg() ?? 0;
        $improvement = $lastWeekAvg > 0 ? (($thisWeekAvg - $lastWeekAvg) / $lastWeekAvg) * 100 : 0;

        $weeklyReview = [
            'avg_score' => round($thisWeekAvg, 1),
            'improvement_pct' => round($improvement, 1),
            'total_focus_minutes' => ActivityLog::where('user_id', $user->id)->where('created_at', '>=', $thisWeekStart)->sum('duration_minutes'),
            'top_mood' => JournalEntry::where('user_id', $user->id)->where('created_at', '>=', $thisWeekStart)->selectRaw('mood_tag, count(*) as count')->groupBy('mood_tag')->orderByDesc('count')->first()?->mood_tag ?? 'Stable',
        ];

        // Stats
        $streak        = $this->calculateStreak($user->id);
        $avgMoodScore  = MoodLog::where('user_id', $user->id)->avg('mood_score') ?? 0;
        $journalCount  = JournalEntry::where('user_id', $user->id)->count();
        $exerciseCount = ActivityLog::where('user_id', $user->id)->where('activity_type', 'exercise')->count();
        $gameCount     = ActivityLog::where('user_id', $user->id)->where('activity_type', 'game')->count();

        $digitalHealthScore = $this->calculateHealthScore(
            $history->first()?->mood_rating ?? $avgMoodScore,
            $journalCount,
            $exerciseCount,
            $gameCount
        );

        return response()->json([
            'user'                 => $user->only('id', 'name', 'email'),
            'streak'               => $streak,
            'mood_score'           => round($avgMoodScore, 1),
            'journal_count'        => $journalCount,
            'exercise_count'       => $exerciseCount,
            'game_count'           => $gameCount,
            'mood_trend'           => $moodLogs->reverse()->values(),
            'assessment_history'   => $history,
            'weekly_review'        => $weeklyReview,
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
