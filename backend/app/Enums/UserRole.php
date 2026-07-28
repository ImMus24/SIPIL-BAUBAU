<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case OFFICER = 'officer';
    case CITIZEN = 'citizen';
    case HEAD_OF_AGENCY = 'head_of_agency';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrator Master',
            self::OFFICER => 'Petugas Lapangan OPD',
            self::CITIZEN => 'Masyarakat / Warga Kota',
            self::HEAD_OF_AGENCY => 'Kepala Dinas / Pimpinan',
        };
    }
}
