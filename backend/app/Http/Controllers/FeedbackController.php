<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $feedback = Feedback::create([
            'user_id' => Auth::id(),
            'rating'  => $data['rating'],
            'comment' => $data['comment'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Feedback stored successfully',
            'data'    => $feedback
        ], 201);
    }
}
