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
            'file' => 'required|file|max:15360', // 15 MB
            'category' => 'nullable|string|in:before,progress,after,support',
        ];
    }
}
