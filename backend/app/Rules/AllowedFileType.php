<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AllowedFileType implements ValidationRule
{
    public function __construct(
        protected array $allowedTypes = [
            'image/jpeg', 'image/png', 'image/webp',
            'application/pdf',
            'video/mp4',
        ]
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (is_array($value)) {
            foreach ($value as $file) {
                if (!in_array($file->getMimeType(), $this->allowedTypes, true)) {
                    $fail('Tipe file tidak diizinkan. Hanya: JPG, PNG, WebP, PDF, MP4.');
                }
            }
        } elseif ($value instanceof \Illuminate\Http\UploadedFile) {
            if (!in_array($value->getMimeType(), $this->allowedTypes, true)) {
                $fail('Tipe file tidak diizinkan. Hanya: JPG, PNG, WebP, PDF, MP4.');
            }
        }
    }
}
