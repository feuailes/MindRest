<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\ExerciseController;

// ─── Public Routes ────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Static exercises — no auth needed
Route::get('/exercises', [App\Http\Controllers\ExerciseController::class, 'index']);
Route::get('/games', [App\Http\Controllers\GamesController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [App\Http\Controllers\AuthController::class, 'logout']);

    // Assessments
    Route::get('/assessment', [App\Http\Controllers\AssessmentController::class, 'index']);
    Route::post('/assessment', [App\Http\Controllers\AssessmentController::class, 'store']);

    // Dashboard
    Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index']);

    // Journals
    Route::get('/journal', [App\Http\Controllers\JournalController::class, 'index']);
    Route::post('/journal', [App\Http\Controllers\JournalController::class, 'store']);
    Route::delete('/journal/{id}', [App\Http\Controllers\JournalController::class, 'destroy']);
    
    // Activity Logs
    Route::post('/activity-logs', [App\Http\Controllers\ActivityLogController::class, 'store']);
});
