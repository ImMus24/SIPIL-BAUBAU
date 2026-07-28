<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateComplaintStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && in_array($user->role, ['admin', 'officer', 'head_of_agency']);
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'notes' => trim(strip_tags($this->notes ?? '')),
        ]);
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:menunggu,diproses,selesai,ditolak',
            'notes' => 'required|string|max:2000',
            'agency_id' => 'nullable|integer|exists:agencies,id',
            'photo_proof' => 'nullable|file|mimes:jpeg,jpg,png,webp|max:5120',
        ];
    }
}
