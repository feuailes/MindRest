<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AssessmentController extends Controller
{
    public function index(Request $request)
    {
        $assessments = Assessment::where('user_id', $request->user()->id)
            ->latest()
            ->take(10)
            ->get();

        return response()->json($assessments);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'sleep_hours'  => 'required|numeric',
            'stress_level' => 'required|integer',
            'screen_time'  => 'required|numeric',
            'mood_rating'  => 'required|integer',
        ]);

        try {
            // Laravel calls Flask
            $response = Http::post('http://127.0.0.1:5000/predict', [
                'screentime' => $data['screen_time'],
                'sleep'      => $data['sleep_hours'],
                'stress'     => $data['stress_level'],
                'mood'       => $data['mood_rating'],
            ]);

            // Ensure we get a response, default to '0' if not
            $prediction = $response->json()['prediction'] ?? '0';
            
            // This is the function that was missing!
            $riskLabel = $this->mapModelPrediction($prediction);

        } catch (\Exception $e) {
            // Log the error so you can see why it failed in storage/logs/laravel.log
            \Log::error("Flask Connection Error: " . $e->getMessage());
            $riskLabel = "Analysis Pending"; 
        }

        $assessment = Assessment::create([
            'user_id'      => $request->user()->id,
            'sleep_hours'  => $data['sleep_hours'],
            'stress_level' => $data['stress_level'],
            'screen_time'  => $data['screen_time'],
            'mood_rating'  => $data['mood_rating'],
            'risk_level'   => $riskLabel, 
        ]);

        return response()->json([
            'success' => true,
            'assessment' => $assessment,
            'risk_label' => $riskLabel 
        ], 201);
    }

    /**
     * Helper to map numeric prediction from Flask to String labels
     */
    private function mapModelPrediction($prediction)
    {
        // Convert to string in case it comes as an int
        $p = (string)$prediction;

        $mapping = [
            '0' => 'Low',
            '1' => 'Moderate',
            '2' => 'High'
        ];

        return $mapping[$p] ?? 'Low';
    }
}