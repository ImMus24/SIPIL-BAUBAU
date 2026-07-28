<?php

namespace App\Helpers;

use Illuminate\Support\Carbon;

class DateHelper
{
    public static function formatToIndonesian(?string $date, string $format = 'd F Y'): ?string
    {
        if (!$date) {
            return null;
        }

        $months = [
            'January' => 'Januari', 'February' => 'Februari', 'March' => 'Maret',
            'April' => 'April', 'May' => 'Mei', 'June' => 'Juni',
            'July' => 'Juli', 'August' => 'Agustus', 'September' => 'September',
            'October' => 'Oktober', 'November' => 'November', 'December' => 'Desember',
        ];

        $days = [
            'Sunday' => 'Minggu', 'Monday' => 'Senin', 'Tuesday' => 'Selasa',
            'Wednesday' => 'Rabu', 'Thursday' => 'Kamis', 'Friday' => 'Jumat',
            'Saturday' => 'Sabtu',
        ];

        $formatted = Carbon::parse($date)->translatedFormat($format);

        return str_replace(
            array_keys($months),
            array_values($months),
            $formatted
        );
    }

    public static function diffForHumans(?string $date): ?string
    {
        if (!$date) {
            return null;
        }

        return Carbon::parse($date)->diffForHumans();
    }
}
