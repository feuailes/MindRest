<?php

namespace App\Services;

use App\Models\MoodLog;
use App\Models\ActivityLog;
use App\Models\JournalEntry;
use App\Models\Assessment;
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

            // 4. Assessment History (Screen Time specifically)
            $assessmentHistory = Assessment::where('user_id', $userId)
                ->where('created_at', '>=', $startDate)
                ->orderBy('created_at', 'asc')
                ->get(['screen_time', 'mood_rating', 'created_at']);

            return [
                'mood_history'    => $moodHistory,
                'exercise_history' => $exerciseHistory,
                'game_history'     => $gameHistory,
                'journal_history'  => $journalHistory,
                'assessment_history' => $assessmentHistory,
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
            $screenSummary = collect($historyData['assessment_history'] ?? [])->map(fn($a) => "Screen: {$a->screen_time}h")->implode(', ');
            $exerciseCount = count($historyData['exercise_history']);
            $journalTags = collect($historyData['journal_history'])->pluck('mood_tag')->unique()->implode(', ');

            $prompt = "You are a wellness specialist focusing on Digital Fatigue and Screen Exhaustion.
            Note: All numeric metrics below use a 1-10 scale where 10 is the Maximum Exhaustion/Stress and 1 is Optimal Wellness.
            
            Analyze this user's recent history: 
            Mood & Sleep History: {$moodSummary}.
            Screen Usage History: {$screenSummary}.
            Recovery Activities: {$exerciseCount} exercises completed.
            User Feedback Tags: {$journalTags}.
            
            Identify one factual trend related to digital habits and one simple recovery tip (e.g., eye rest, screen-free time). 
            Keep the language plain, factual, and very easy to understand.
            Under 150 characters.";

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

    /**
     * Generate an insight for a single assessment result.
     *
     * @param \App\Models\Assessment $assessment
     * @return string
     */
    public function generateSingleAssessmentInsight(\App\Models\Assessment $assessment): string
    {
        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) return "";

        try {
            $data = [
                'screen' => $assessment->screen_time,
                'stress' => $assessment->stress_level,
                'sleep' => $assessment->sleep_hours,
                'mood' => $assessment->mood_rating
            ];

            $prompt = "Analyze this assessment result: Screen Time: {$data['screen']}h, Stress: {$data['stress']}, Sleep: {$data['sleep']}, Mood: {$data['mood']}.
            All metrics use 1-10 scale where 10 is Worst/Exhaustion.
            Provide a 1-sentence, factual, plain-language explanation of why this user is exhausted or at risk. 
            Under 120 characters.";

            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key={$apiKey}", [
                'contents' => [['parts' => [['text' => $prompt]]]]
            ]);

            if ($response->successful()) {
                $res = $response->json();
                return $res['candidates'][0]['content']['parts'][0]['text'] ?? "";
            }
            return "";
        } catch (\Exception $e) {
            Log::error("Single Assessment Gemini Error: " . $e->getMessage());
            return "";
        }
    }

    /**
     * Predict the optimal break time based on historical exhaustion peaks.
     *
     * @param int $userId
     * @return array
     */
    public function predictOptimalBreak(int $userId): array
    {
        try {
            $assessments = \App\Models\Assessment::where('user_id', $userId)
                ->whereIn('risk_level', ['High', 'Moderate', 'High Exhaustion', 'Moderate Exhaustion'])
                ->latest()
                ->take(20)
                ->get(['created_at']);

            if ($assessments->count() < 3) {
                return [
                    'recommended_time' => null,
                    'message' => 'Keep logging assessments to unlock personal break predictions.'
                ];
            }

            // Extract hours
            $hours = $assessments->map(fn($a) => Carbon::parse($a->created_at)->hour);

            // Find the most frequent hour (mode)
            $frequencies = array_count_values($hours->toArray());
            arsort($frequencies);
            $peakHour = array_key_first($frequencies);

            // Suggest a break 30 minutes before the peak hour
            $breakTime = Carbon::createFromTime($peakHour, 0, 0)->subMinutes(30);

            return [
                'recommended_time' => $breakTime->format('g:i A'),
                'peak_hour' => $peakHour,
                'message' => "Your exhaustion typically peaks around " . Carbon::createFromTime($peakHour, 0, 0)->format('g:i A') . ". We suggest a proactive break at " . $breakTime->format('g:i A') . "."
            ];

        } catch (\Exception $e) {
            Log::error("Predictive Break Error: " . $e->getMessage());
            return [
                'recommended_time' => null,
                'message' => 'Unable to calculate prediction at this time.'
            ];
        }
    }
}
