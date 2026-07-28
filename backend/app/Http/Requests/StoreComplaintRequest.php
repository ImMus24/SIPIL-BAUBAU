<?php

namespace App\Http\Requests;

use App\Rules\AllowedSubdistrict;
use App\Rules\IndonesianPhoneNumber;
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
            'reporter_phone' => trim(preg_replace('/[^0-9+]/', '', $this->reporter_phone ?? '')),
            'reporter_email' => strtolower(trim($this->reporter_email ?? '')),
        ]);
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'category_id' => 'required|integer|exists:categories,id',
            'subdistrict' => ['required', 'string', 'max:100', new AllowedSubdistrict],
            'address' => 'required|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'urgency' => 'required|in:rendah,sedang,tinggi,darurat',
            'reporter_name' => 'required|string|max:255',
            'reporter_phone' => ['nullable', 'string', 'max:30', new IndonesianPhoneNumber],
            'reporter_email' => 'nullable|email|max:255',
            'attachments' => 'nullable|array|max:5',
            'attachments.*' => 'file|mimes:jpeg,jpg,png,webp,pdf|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul laporan wajib diisi.',
            'title.max' => 'Judul laporan maksimal 255 karakter.',
            'description.required' => 'Deskripsi laporan wajib diisi.',
            'description.max' => 'Deskripsi laporan maksimal 5000 karakter.',
            'category_id.required' => 'Kategori laporan wajib dipilih.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid.',
            'subdistrict.required' => 'Kecamatan wajib dipilih.',
            'address.required' => 'Alamat wajib diisi.',
            'address.max' => 'Alamat maksimal 500 karakter.',
            'latitude.between' => 'Latitude harus antara -90 dan 90.',
            'longitude.between' => 'Longitude harus antara -180 dan 180.',
            'urgency.required' => 'Tingkat urgensi wajib dipilih.',
            'urgency.in' => 'Tingkat urgensi tidak valid.',
            'reporter_name.required' => 'Nama pelapor wajib diisi.',
            'reporter_name.max' => 'Nama pelapor maksimal 255 karakter.',
            'reporter_email.email' => 'Format email tidak valid.',
            'reporter_email.max' => 'Email maksimal 255 karakter.',
            'attachments.max' => 'Maksimal 5 file lampiran.',
            'attachments.*.file' => 'Lampiran harus berupa file.',
            'attachments.*.mimes' => 'Tipe file harus: jpeg, jpg, png, webp, pdf.',
            'attachments.*.max' => 'Ukuran file maksimal 5MB.',
        ];
    }
}
