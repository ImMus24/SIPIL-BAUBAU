<?php

namespace App\Enums;

enum ComplaintStatus: string
{
    case PENDING = 'menunggu';
    case IN_PROGRESS = 'diproses';
    case COMPLETED = 'selesai';
    case REJECTED = 'ditolak';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Menunggu Verifikasi',
            self::IN_PROGRESS => 'Sedang Diproses OPD',
            self::COMPLETED => 'Selesai Ditangani',
            self::REJECTED => 'Laporan Ditolak',
        };
    }
}
