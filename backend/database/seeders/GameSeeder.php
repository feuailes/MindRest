<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        $games = [
            ['name' => 'Breathing Bubble', 'description' => 'Simple breathing exercises to help you feel calmer.', 'game_url' => 'https://calm.com/breathe'],
            ['name' => 'Zen Sand Garden', 'description' => 'Gentle sand art to help you relax and unwind.', 'game_url' => 'https://thisissand.com/'],
            ['name' => 'Soft Rain Simulator', 'description' => 'Peaceful rain sounds to help you de-stress.', 'game_url' => 'https://rainymood.com/'],
            ['name' => 'Word Guess', 'description' => 'Light word puzzles to give your mind a gentle workout.', 'game_url' => 'https://wordlegame.org/'],
            ['name' => 'Memory Cards', 'description' => 'Memory games to help you focus and feel more present.', 'game_url' => 'https://www.memozor.com/memory-games/for-adults'],
            ['name' => 'Flow Free', 'description' => 'Simple puzzles that help you get into a flow state.', 'game_url' => 'https://www.coolmathgames.com/0-flow-free'],
            ['name' => 'Color Me Calm', 'description' => 'Gentle coloring to help you unwind and feel creative.', 'game_url' => 'https://thecolor.com/'],
            ['name' => 'Scribble Doodle', 'description' => 'Free drawing to help release tension and relax.', 'game_url' => 'https://skribbl.io/'],
            ['name' => 'Calm Piano Tiles', 'description' => 'Rhythmic tapping to help improve focus and calm.', 'game_url' => 'https://www.agame.com/game/magic-piano-tiles'],
        ];

        foreach ($games as $game) {
            Game::updateOrCreate(['name' => $game['name']], $game);
        }
    }
}
