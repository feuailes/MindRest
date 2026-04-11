<?php

namespace App\Services;

use App\Models\MoodLog;
use App\Models\ActivityLog;
use App\Models\JournalEntry;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class UserInsightService
{
    /**
     * Get history for the last 7 days for a given user.
     *
     * @param int $userId
     * @return array
     */
    public function getRecentHistory(int $userId): array
    {
        try {
            $startDate = Carbon::now()->subDays(7)->startOfDay();

            // 1. Mood & Sleep History (Daily Logs)
            $moodHistory = MoodLog::where('user_id', $userId)
                ->where('log_date', '>=', $startDate->toDateString())
                ->orderBy('log_date', 'asc')
                ->get(['mood_score', 'sleep_hours', 'log_date']);

            // 2. Exercise & Games History
            $activityHistory = ActivityLog::where('user_id', $userId)
                ->whereIn('activity_type', ['exercise', 'game'])
                ->where('created_at', '>=', $startDate)
                ->orderBy('created_at', 'asc')
                ->get(['id', 'duration_minutes', 'exercise_id', 'game_id', 'activity_type', 'score', 'created_at']);

            $exerciseHistory = $activityHistory->where('activity_type', 'exercise');
            $gameHistory     = $activityHistory->where('activity_type', 'game');

            // 3. Journal History
            $journalHistory = JournalEntry::where('user_id', $userId)
                ->where('created_at', '>=', $startDate)
                ->orderBy('created_at', 'asc')
                ->get(['id', 'title', 'mood_tag', 'created_at']);

            return [
                'mood_history'    => $moodHistory,
                'exercise_history' => $exerciseHistory,
                'game_history'     => $gameHistory,
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

    /**
     * Generate a personalized insight using Gemini AI.
     *
     * @param array $historyData
     * @return string
     */
    public function generateAIPersonalizedInsight(array $historyData): string
    {
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return "Focus on your rest today — small steps lead to big changes.";
        }

        try {
            // Simplify data for the prompt
            $moodSummary = collect($historyData['mood_history'])->map(fn($m) => "Mood: {$m->mood_score}, Sleep: {$m->sleep_hours}h ({$m->log_date})")->implode('; ');
            $exerciseCount = count($historyData['exercise_history']);
            $gameStats = collect($historyData['game_history']);
            $gameInfo = $gameStats->isEmpty() ? "No games played." : "{$gameStats->count()} games played, avg score: " . round($gameStats->avg('score'), 1);
            $journalTags = collect($historyData['journal_history'])->pluck('mood_tag')->unique()->implode(', ');

            $prompt = "Based on this user's 7-day history: 
            Mood & Sleep: {$moodSummary}.
            Exercises completed: {$exerciseCount}.
            Gaming Activity: {$gameInfo}.
            Journal Themes: {$journalTags}.
            
            Identify one positive trend and one area for improvement. 
            Keep it encouraging and under 3 lines. 
            Do not just repeat the numbers.";

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['candidates'][0]['content']['parts'][0]['text'] ?? "Your mindful journey is evolving. Stay consistent!";
            }

            Log::warning("Gemini API Error: " . $response->body());
            return "Focus on your rest today — small steps lead to big changes.";

        } catch (\Exception $e) {
            Log::error("Gemini Integration Exception: " . $e->getMessage());
            return "A mindful moment is always within reach. Keep going!";
        }
    }
}
