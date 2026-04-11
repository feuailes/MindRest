<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        $games = [
            ['name' => 'Breathing Circle', 'description' => 'Guided breathing for instant calm.', 'game_url' => 'https://calm.com/breathe'],
            ['name' => 'Bubble Pop', 'description' => 'Pop bubbles to release tension.', 'game_url' => 'https://thisissand.com/'],
            ['name' => 'Reaction Test', 'description' => 'Test focus with rapid color changes.', 'game_url' => 'https://humanbenchmark.com/tests/reactiontime'],
            ['name' => 'Memory Match', 'description' => 'Find pairs of hidden symbols.', 'game_url' => 'https://www.memozor.com/memory-games/for-adults'],
            ['name' => 'Zen Sand', 'description' => 'Draw patterns in digital sand.', 'game_url' => 'https://thisissand.com/'],
            ['name' => 'Shade Finder', 'description' => 'Spot the odd color to test visual focus.', 'game_url' => 'https://thecolor.com/'],
        ];

        foreach ($games as $game) {
            Game::updateOrCreate(['name' => $game['name']], $game);
        }
    }
}
