<?php

namespace App\Jobs;

use App\Models\Complaint;
use App\Services\NotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendComplaintNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 60;
    public int $tries = 3;

    public function __construct(
        protected Complaint $complaint,
        protected string $type = 'created',
        protected ?string $oldStatus = null,
        protected ?string $newStatus = null,
    ) {}

    public function handle(NotificationService $notificationService): void
    {
        if ($this->type === 'created') {
            $notificationService->notifyComplaintCreated($this->complaint);
        } elseif ($this->type === 'status_updated') {
            $notificationService->notifyStatusUpdated(
                $this->complaint,
                $this->oldStatus ?? '',
                $this->newStatus ?? '',
            );
        }
    }

    public function failed(\Throwable $e): void
    {
        logger()->error('Gagal mengirim notifikasi', [
            'complaint_id' => $this->complaint->id,
            'type' => $this->type,
            'error' => $e->getMessage(),
        ]);
    }
}
