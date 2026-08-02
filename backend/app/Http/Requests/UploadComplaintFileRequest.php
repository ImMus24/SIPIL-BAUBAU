<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadComplaintFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Access is authorized upstream via ComplaintPolicy::updateStatus (admin/officer/head).
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => 'required|file|mimes:jpeg,jpg,png,webp,pdf,mp4,mov|max:15360', // 15 MB
            'category' => 'nullable|string|in:before,progress,after,support',
        ];
    }

    public function messages(): array
    {
        return [
            'file.mimes' => 'Tipe berkas harus berupa: jpeg, jpg, png, webp, pdf, mp4, atau mov.',
            'file.max' => 'Ukuran berkas maksimal 15 MB.',
        ];
    }
}
