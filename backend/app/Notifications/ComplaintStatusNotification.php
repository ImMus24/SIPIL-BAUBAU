<?php

namespace App\Notifications;

use App\Models\Complaint;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ComplaintStatusNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected Complaint $complaint,
        protected string $oldStatus,
        protected string $newStatus,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $statusMap = [
            'menunggu' => 'Menunggu Verifikasi',
            'diproses' => 'Sedang Diproses',
            'selesai' => 'Selesai',
            'ditolak' => 'Ditolak',
        ];

        return (new MailMessage)
            ->subject("Update Status: {$this->complaint->ticket_code}")
            ->greeting("Halo {$notifiable->name},")
            ->line("Status laporan Anda telah diperbarui.")
            ->line("Kode Tiket: {$this->complaint->ticket_code}")
            ->line("Judul: {$this->complaint->title}")
            ->line("Status: {$statusMap[$this->oldStatus]} → {$statusMap[$this->newStatus]}")
            ->line("Catatan: {$this->complaint->statusLogs()->latest()->first()?->notes ?? '-'}")
            ->action('Cek Status', url("/track?ticket={$this->complaint->ticket_code}"))
            ->line('Terima kasih telah menggunakan SIPIL BAUBAU.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'complaint_status_updated',
            'title' => 'Update Status Pengaduan',
            'message' => "Status {$this->complaint->ticket_code}: {$this->oldStatus} → {$this->newStatus}",
            'complaint_id' => $this->complaint->id,
            'ticket_code' => $this->complaint->ticket_code,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
        ];
    }
}
