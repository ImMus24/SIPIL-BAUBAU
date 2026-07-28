<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim(strip_tags($this->name ?? '')),
            'email' => strtolower(trim($this->email ?? '')),
            'phone' => trim(strip_tags($this->phone ?? '')),
        ]);
    }

    public function rules(): array
    {
        return [
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|string|email|max:255|unique:users,email',
            'password'              => 'required|string|min:8|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/',
            'password_confirmation' => 'sometimes|same:password',
            'phone'                 => 'nullable|string|max:20',
        ];
    }

    public function messages(): array
    {
        return [
            'password.regex' => 'Kata sandi harus mengandung minimal 1 huruf besar, 1 huruf kecil, dan 1 angka.',
            'email.unique' => 'Alamat email sudah terdaftar dalam sistem.',
        ];
    }
}
