<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AllowedSubdistrict implements ValidationRule
{
    private const SUBDISTRICTS = [
        'Wolio', 'Betoambari', 'Murhum', 'Kokalukuna',
        'Lea-Lea', 'Sorawolio', 'Bungi', 'Batupoaro',
    ];

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!in_array($value, self::SUBDISTRICTS, true)) {
            $fail('Kecamatan tidak valid. Pilih salah satu kecamatan yang tersedia di Kota Baubau.');
        }
    }
}
