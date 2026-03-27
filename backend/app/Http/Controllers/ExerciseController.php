<?php

namespace App\Http\Controllers;

use App\Models\Exercise;

class ExerciseController extends Controller
{
    /** GET /api/exercises — returns dynamic list of mindfulness exercises */
    public function index()
    {
        $exercises = Exercise::all();
        return response()->json($exercises);
    }
}
