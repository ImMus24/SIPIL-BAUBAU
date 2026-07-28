<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AgencyController;
use App\Http\Controllers\StatController;

Route::prefix('v1')->group(function () {

    // Auth Routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Public Categories & Agencies
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/agencies', [AgencyController::class, 'index']);

    // Public Complaints & Lookup
    Route::get('/complaints', [ComplaintController::class, 'index']);
    Route::post('/complaints', [ComplaintController::class, 'store']);
    Route::get('/complaints/ticket/{ticket_code}', [ComplaintController::class, 'showByTicket']);

    // Statistics
    Route::get('/stats/summary', [StatController::class, 'summary']);

    // Protected Routes (Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::get('/complaints/my-reports', [ComplaintController::class, 'myReports']);
        Route::post('/complaints/{id}/status', [ComplaintController::class, 'updateStatus']);
    });

});
