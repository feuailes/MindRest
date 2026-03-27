<?php

namespace App\Http\Controllers;

use App\Models\Game;

class GamesController extends Controller
{
    /** GET /api/games — returns dynamic list of mindfulness games */
    public function index()
    {
        $games = Game::all();
        return response()->json($games);
    }
}
