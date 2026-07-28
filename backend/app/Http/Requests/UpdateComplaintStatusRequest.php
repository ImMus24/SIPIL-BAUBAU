<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateComplaintStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        if (!$user) return false;

        // $user->role is UserRole backed enum — compare by value
        $role = $user->role instanceof \App\Enums\UserRole
            ? $user->role->value
            : $user->role;

        return in_array($role, ['admin', 'officer', 'head_of_agency'], true);
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
