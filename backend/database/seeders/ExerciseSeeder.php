<?php

namespace Database\Seeders;

use App\Models\Exercise;
use Illuminate\Database\Seeder;

class ExerciseSeeder extends Seeder
{
    public function run(): void
    {
        $exercises = [
            [
                'title'       => 'Deep Breathing',
                'description' => 'A foundational practice to calm the nervous system and center your mind.',
                'duration_minutes' => 5,
                'difficulty_level' => 'Beginner',
            ],
            [
                'title'       => 'Morning Zen',
                'description' => 'Set a positive intention for your day with this calming morning visualization.',
                'duration_minutes' => 10,
                'difficulty_level' => 'Intermediate',
            ],
            [
                'title'       => 'Body Scan',
                'description' => 'A deep dive into physical sensations to release stored tension and stress.',
                'duration_minutes' => 20,
                'difficulty_level' => 'Advanced',
            ],
            [
                'title'       => 'Quick Reset',
                'description' => 'A short, powerful exercise to regain composure during a busy day.',
                'duration_minutes' => 3,
                'difficulty_level' => 'All Levels',
            ],
            [
                'title' => 'Box Breathing',
                'description' => 'Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat.',
                'duration_minutes' => 4,
                'difficulty_level' => 'Beginner'
            ],
            [
                'title' => '5-4-3-2-1 Grounding',
                'description' => 'Notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.',
                'duration_minutes' => 5,
                'difficulty_level' => 'All Levels'
            ]
        ];

        foreach ($exercises as $ex) {
            Exercise::updateOrCreate(['title' => $ex['title']], $ex);
        }
    }
}
