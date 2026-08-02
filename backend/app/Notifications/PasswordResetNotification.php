<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordResetNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected string $token,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $resetUrl = url("/reset-password?token={$this->token}&email=" . urlencode($notifiable->email));

        return (new MailMessage)
            ->subject('Reset Kata Sandi — SIPIL BAUBAU')
            ->greeting("Halo {$notifiable->name},")
            ->line('Anda menerima email ini karena kami menerima permintaan reset kata sandi untuk akun Anda.')
            ->action('Reset Kata Sandi', $resetUrl)
            ->line('Tautan ini berlaku selama 60 menit.')
            ->line('Jika Anda tidak meminta reset kata sandi, abaikan email ini.');
    }
}
