<?php

namespace App\Services;

use App\Models\MoodLog;
use App\Models\ActivityLog;
use App\Models\JournalEntry;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class UserInsightService
{
    /**
     * Get history for the last 14 days for a given user.
     *
     * @param int $userId
     * @return array
     */
    public function getRecentHistory(int $userId): array
    {
        try {
            $startDate = Carbon::now()->subDays(14)->startOfDay();

            // 1. Mood & Sleep History (Daily Logs)
            $moodHistory = MoodLog::where('user_id', $userId)
                ->where('log_date', '>=', $startDate->toDateString())
                ->orderBy('log_date', 'asc')
                ->get(['mood_score', 'sleep_hours', 'log_date']);

            // 2. Exercise History
            $exerciseHistory = ActivityLog::where('user_id', $userId)
                ->where('activity_type', 'exercise')
                ->where('created_at', '>=', $startDate)
                ->orderBy('created_at', 'asc')
                ->get(['id', 'duration_minutes', 'exercise_id', 'created_at']);

            // 3. Journal History
            $journalHistory = JournalEntry::where('user_id', $userId)
                ->where('created_at', '>=', $startDate)
                ->orderBy('created_at', 'asc')
                ->get(['id', 'title', 'mood_tag', 'created_at']);

            return [
                'mood_history'    => $moodHistory,
                'exercise_history' => $exerciseHistory,
                'journal_history'  => $journalHistory,
                'correlation_data' => $moodHistory->map(fn($item) => [
                    'x' => (float)$item->sleep_hours,
                    'y' => (int)$item->mood_score,
                    'date' => $item->log_date
                ])
            ];

        } catch (\Exception $e) {
            Log::error("UserInsightService Error: " . $e->getMessage());
            return [
                'mood_history'    => [],
                'exercise_history' => [],
                'journal_history'  => [],
                'correlation_data' => []
            ];
        }
    }
}
