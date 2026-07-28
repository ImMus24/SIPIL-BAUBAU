<?php

namespace App\Listeners;

use App\Events\ComplaintCreated;
use App\Events\ComplaintStatusUpdated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendComplaintNotificationListener implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(object $event): void
    {
        if ($event instanceof ComplaintCreated) {
            Log::info("Async Notification: New complaint created [{$event->complaint->ticket_code}]");
        } elseif ($event instanceof ComplaintStatusUpdated) {
            Log::info("Async Notification: Status updated for complaint [{$event->complaint->ticket_code}] from {$event->oldStatus} to {$event->newStatus}");
        }
    }
}
