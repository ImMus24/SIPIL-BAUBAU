<?php

namespace App\Services;

use App\Actions\RegisterUserAction;
use App\Actions\LogoutUserAction;
use App\Contracts\UserRepositoryInterface;
use App\DTOs\RegisterUserDTO;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository,
        protected RegisterUserAction $registerUserAction,
        protected LogoutUserAction $logoutUserAction,
    ) {}

    public function register(RegisterUserDTO $dto): array
    {
        $user = $this->registerUserAction->execute($dto);

        $token = $user->createToken('sipil_baubau_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function login(string $email, string $password): array
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user || !Hash::check($password, $user->password)) {
            AuditLog::log('LOGIN_FAILED', "Percobaan login gagal untuk email: {$email}");

            throw ValidationException::withMessages([
                'email' => ['Email atau kata sandi salah.'],
            ]);
        }

        // Revoke old tokens for session security
        $user->tokens()->delete();

        $token = $user->createToken('sipil_baubau_token')->plainTextToken;

        AuditLog::log('USER_LOGGED_IN', "Pengguna {$user->name} berhasil login.", null, [
            'user_id' => $user->id,
            'role' => $user->role->value,
        ], $user);

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function logout(?User $user): void
    {
        $this->logoutUserAction->execute($user);
    }
}
