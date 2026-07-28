<?php

namespace App\Notifications;

use App\Models\Complaint;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ComplaintCreatedNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected Complaint $complaint
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Pengaduan Baru: {$this->complaint->ticket_code}")
            ->greeting("Halo {$notifiable->name},")
            ->line("Sebuah laporan pengaduan baru telah masuk.")
            ->line("Kode Tiket: {$this->complaint->ticket_code}")
            ->line("Judul: {$this->complaint->title}")
            ->line("Kecamatan: {$this->complaint->subdistrict}")
            ->line("Tingkat Urgensi: {$this->complaint->urgency}")
            ->action('Lihat Detail', url("/admin/reports/{$this->complaint->id}"))
            ->line('Silakan lakukan verifikasi dan tindak lanjut.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'complaint_created',
            'title' => 'Pengaduan Baru',
            'message' => "Pengaduan {$this->complaint->ticket_code}: {$this->complaint->title}",
            'complaint_id' => $this->complaint->id,
            'ticket_code' => $this->complaint->ticket_code,
            'urgency' => $this->complaint->urgency,
        ];
    }
}
