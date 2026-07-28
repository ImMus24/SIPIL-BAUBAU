<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AgencyController;
use App\Http\Controllers\StatController;
use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\RoleMiddleware;

Route::middleware([SecurityHeaders::class])->prefix('v1')->group(function () {

    // Auth Routes with Rate Limiting (5 attempts per minute)
    Route::middleware('throttle:5,1')->group(function () {
        Route::post('/auth/register', [AuthController::class, 'register']);
        Route::post('/auth/login', [AuthController::class, 'login']);
    });

    // Public Categories & Agencies
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/agencies', [AgencyController::class, 'index']);

    // Public Complaints & Lookup
    Route::get('/complaints', [ComplaintController::class, 'index']);
    Route::get('/complaints/ticket/{ticket_code}', [ComplaintController::class, 'showByTicket']);

    // Complaint Submission with Rate Limiting (10 submissions per minute)
    Route::post('/complaints', [ComplaintController::class, 'store'])->middleware('throttle:10,1');

    // Public Statistics
    Route::get('/stats/summary', [StatController::class, 'summary']);

    // Protected Routes (Sanctum Authentication Required)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::get('/complaints/my-reports', [ComplaintController::class, 'myReports']);

        // RBAC Protected Status Update (Only Admin, Officer, Head of Agency)
        Route::post('/complaints/{id}/status', [ComplaintController::class, 'updateStatus'])
            ->middleware(RoleMiddleware::class . ':admin,officer,head_of_agency');
    });

});
