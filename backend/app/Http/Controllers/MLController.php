<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MLController extends Controller
{
    public function predict(Request $request)
    {
        // Call Flask ML API
        $response = Http::post('http://127.0.0.1:8000/predict', $request->all());

        // Return prediction to React
        return response()->json($response->json());
    }
}