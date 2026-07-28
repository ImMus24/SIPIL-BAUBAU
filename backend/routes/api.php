<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ComplaintController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\DataController;
use App\Http\Controllers\Api\V1\StatController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\RoleMiddleware;

Route::middleware([SecurityHeaders::class])->prefix('v1')->group(function () {

    // Auth Routes with Rate Limiting (5 attempts per minute)
    Route::middleware('throttle:5,1')->group(function () {
        Route::post('/auth/register', [AuthController::class, 'register']);
        Route::post('/auth/login', [AuthController::class, 'login']);
    });

    // Public Categories & Agencies (cached 1 hour)
    Route::get('/categories', [DataController::class, 'categories']);
    Route::get('/agencies', [DataController::class, 'agencies']);

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

        // Role-specific Dashboard Endpoints
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::get('/dashboard/citizen', [DashboardController::class, 'citizenDashboard']);
        Route::get('/dashboard/officer', [DashboardController::class, 'officerDashboard']);
        Route::get('/dashboard/admin', [DashboardController::class, 'adminDashboard']);
        Route::get('/dashboard/head', [DashboardController::class, 'headDashboard']);
        Route::get('/dashboard/map-data', [DashboardController::class, 'mapData']);
        Route::get('/dashboard/search', [DashboardController::class, 'quickSearch']);
        Route::get('/dashboard/activities', [DashboardController::class, 'activities']);

        // Notification Routes
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
        Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

        // RBAC Protected Status Update (Only Admin, Officer, Head of Agency)
        Route::post('/complaints/{id}/status', [ComplaintController::class, 'updateStatus'])
            ->middleware(RoleMiddleware::class . ':admin,officer,head_of_agency');
    });

});
