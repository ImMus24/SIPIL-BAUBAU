<?php

namespace App\Listeners;

use App\Events\ComplaintCreated;
use App\Events\ComplaintStatusUpdated;
use App\Jobs\SendComplaintNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendComplaintNotificationListener implements ShouldQueue
{
    public $queue = 'notifications';

    public function handle(object $event): void
    {
        if ($event instanceof ComplaintCreated) {
            SendComplaintNotification::dispatch(
                $event->complaint,
                'created'
            )->onQueue('notifications');
        } elseif ($event instanceof ComplaintStatusUpdated) {
            SendComplaintNotification::dispatch(
                $event->complaint,
                'status_updated',
                $event->oldStatus,
                $event->newStatus,
            )->onQueue('notifications');
        }
    }
}
