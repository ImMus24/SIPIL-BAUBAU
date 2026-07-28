<?php

namespace App\Events;

use App\Models\Complaint;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ComplaintStatusUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Complaint $complaint,
        public string $oldStatus,
        public string $newStatus
    ) {}
}
