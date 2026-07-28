<?php

namespace App\Enums;

enum UrgencyLevel: string
{
    case LOW = 'rendah';
    case MEDIUM = 'sedang';
    case HIGH = 'tinggi';
    case EMERGENCY = 'darurat';

    public function label(): string
    {
        return match ($this) {
            self::LOW => 'Rendah',
            self::MEDIUM => 'Sedang',
            self::HIGH => 'Tinggi',
            self::EMERGENCY => 'Darurat',
        };
    }
}
