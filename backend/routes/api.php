<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\GamesController; // Added for games
use App\Http\Controllers\ActivityLogController; // Added for activity logs
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ContactController;

// ─── Public Routes ────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/google-login', [AuthController::class, 'googleLogin']);

// Static content — no auth needed
Route::get('/exercises', [ExerciseController::class, 'index']);
Route::get('/games', [GamesController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']); // Public Contact Us
Route::post('/feedback', [FeedbackController::class, 'store']); // Public Feedback

// ─── Protected Routes (Requires Login Token) ──────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Assessments (This is where the Form data should go)
    // React URL: http://127.0.0.1:8000/api/assessment
    Route::get('/assessment', [AssessmentController::class, 'index']);
    Route::post('/assessment', [AssessmentController::class, 'store']);

    // Dashboard Data
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/insight', [DashboardController::class, 'insight']); // Async AI insight

    // Journals
    Route::get('/journal', [JournalController::class, 'index']);
    Route::post('/journal', [JournalController::class, 'store']);
    Route::delete('/journal/{id}', [JournalController::class, 'destroy']);
    
    // Activity Logs
    Route::post('/activity-logs', [ActivityLogController::class, 'store']);
    Route::get('/activity-logs/recent-game', [ActivityLogController::class, 'getRecentGame']);
});