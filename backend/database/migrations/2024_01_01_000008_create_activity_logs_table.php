<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('exercise_id')->nullable()->constrained('exercises')->onDelete('cascade');
            $table->foreignId('game_id')->nullable()->constrained('games')->onDelete('cascade');
            $table->string('activity_type', 50);
            $table->integer('duration_minutes');
            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
