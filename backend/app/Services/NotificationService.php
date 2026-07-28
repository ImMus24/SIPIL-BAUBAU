<?php

namespace App\Services;

use App\Models\Complaint;
use App\Models\User;
use App\Notifications\ComplaintCreatedNotification;
use App\Notifications\ComplaintStatusNotification;
use Illuminate\Support\Facades\Notification;

class NotificationService
{
    public function notifyComplaintCreated(Complaint $complaint): void
    {
        $admins = User::query()->where('role', 'admin')->get();

        Notification::send($admins, new ComplaintCreatedNotification($complaint));
    }

    public function notifyStatusUpdated(Complaint $complaint, string $oldStatus, string $newStatus): void
    {
        // Notify the reporter
        if ($complaint->user) {
            $complaint->user->notify(new ComplaintStatusNotification($complaint, $oldStatus, $newStatus));
        }

        // Notify admin if status was updated by officer
        $updaterRole = request()->user()?->role;
        if ($updaterRole === 'officer') {
            $admins = User::query()->where('role', 'admin')->get();
            Notification::send($admins, new ComplaintStatusNotification($complaint, $oldStatus, $newStatus));
        }
    }
}
