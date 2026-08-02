<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreComplaintCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Access is authorized upstream via ComplaintPolicy::view.
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'body' => trim(strip_tags($this->body ?? '')),
        ]);
    }

    public function rules(): array
    {
        return [
            'body' => 'required|string|min:1|max:2000',
        ];
    }
}
