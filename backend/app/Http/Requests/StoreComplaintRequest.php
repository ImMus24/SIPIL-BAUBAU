<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreComplaintRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'title' => trim(strip_tags($this->title ?? '')),
            'description' => trim(strip_tags($this->description ?? '')),
            'subdistrict' => trim(strip_tags($this->subdistrict ?? '')),
            'address' => trim(strip_tags($this->address ?? '')),
            'reporter_name' => trim(strip_tags($this->reporter_name ?? '')),
            'reporter_phone' => trim(strip_tags($this->reporter_phone ?? '')),
            'reporter_email' => strtolower(trim($this->reporter_email ?? '')),
        ]);
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'category_id' => 'required|integer|exists:categories,id',
            'subdistrict' => 'required|string|max:100',
            'address' => 'required|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'urgency' => 'required|in:rendah,sedang,tinggi,darurat',
            'reporter_name' => 'required|string|max:255',
            'reporter_phone' => 'nullable|string|max:30',
            'reporter_email' => 'nullable|email|max:255',
            'attachments.*' => 'nullable|file|mimes:jpeg,jpg,png,webp,pdf|max:5120',
        ];
    }
}
