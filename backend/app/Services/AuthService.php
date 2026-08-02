<?php

namespace App\Services;

use App\Actions\RegisterUserAction;
use App\Actions\LogoutUserAction;
use App\Contracts\UserRepositoryInterface;
use App\DTOs\RegisterUserDTO;
use App\Models\AuditLog;
use App\Models\User;
use App\Notifications\PasswordResetNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
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

    /**
     * Send a password reset link. Uses a token stored in password_reset_tokens
     * (expires after 60 minutes). Always succeeds silently for non-existent
     * emails to avoid user enumeration.
     */
    public function sendPasswordResetLink(string $email): void
    {
        $user = $this->userRepository->findByEmail($email);
        if (!$user) {
            return; // Do not reveal whether the email exists.
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            ['token' => Hash::make($token), 'created_at' => now()]
        );

        $user->notify(new PasswordResetNotification($token));
    }

    /**
     * Reset the password using a valid token.
     *
     * @throws ValidationException when the token is invalid or expired.
     */
    public function resetPassword(array $validated): void
    {
        $record = DB::table('password_reset_tokens')->where('email', $validated['email'])->first();

        if (!$record || !Hash::check($validated['token'], $record->token)) {
            throw ValidationException::withMessages([
                'token' => ['Tautan reset tidak valid. Silakan ulangi permintaan reset.'],
            ]);
        }

        if (now()->diffInMinutes($record->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();
            throw ValidationException::withMessages([
                'token' => ['Tautan reset telah kedaluwarsa. Silakan ulangi permintaan reset.'],
            ]);
        }

        $user = $this->userRepository->findByEmail($validated['email']);
        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['Akun tidak ditemukan.'],
            ]);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        // Invalidate the token + all existing sessions (force re-login).
        DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();
        $user->tokens()->delete();
    }
}
