<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class IndonesianPhoneNumber implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $cleaned = preg_replace('/[^0-9]/', '', $value);

        if (!preg_match('/^(0[1-9][0-9]{7,11})$/', $cleaned)) {
            $fail('Nomor telepon Indonesia tidak valid. Contoh: 081234567890.');
        }
    }
}
