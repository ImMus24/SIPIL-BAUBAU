<?php

namespace App\DTOs;

readonly class RegisterUserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public ?string $phone = null,
        public string $role = 'citizen',
    ) {}

    public static function fromRequest(array $validated): self
    {
        return new self(
            name: $validated['name'],
            email: $validated['email'],
            password: $validated['password'],
            phone: $validated['phone'] ?? null,
            role: $validated['role'] ?? 'citizen',
        );
    }
}
