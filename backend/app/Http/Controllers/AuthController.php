<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AuditLog;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'citizen',
            'phone' => $validated['phone'] ?? null,
        ]);

        $token = $user->createToken('sipil_baubau_token')->plainTextToken;

        AuditLog::log('USER_REGISTERED', "Pengguna {$user->name} ({$user->email}) berhasil mendaftar.", null, [
            'id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
        ], $user);

        return response()->json([
            'status' => 'success',
            'message' => 'Registrasi akun berhasil.',
            'data' => [
                'user' => $user,
                'token' => $token,
            ]
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            AuditLog::log('LOGIN_FAILED', "Percobaan login gagal untuk email: {$validated['email']}");

            throw ValidationException::withMessages([
                'email' => ['Kombinasi email atau kata sandi tidak valid.'],
            ]);
        }

        // Invalidate old tokens for session security
        $user->tokens()->delete();

        $token = $user->createToken('sipil_baubau_token')->plainTextToken;

        AuditLog::log('USER_LOGGED_IN', "Pengguna {$user->name} berhasil login.", null, [
            'user_id' => $user->id,
            'role' => $user->role,
        ], $user);

        return response()->json([
            'status' => 'success',
            'message' => 'Login berhasil.',
            'data' => [
                'user' => $user->load('agency'),
                'token' => $token,
            ]
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => $request->user()->load('agency'),
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            AuditLog::log('USER_LOGGED_OUT', "Pengguna {$user->name} logout dari sistem.", null, null, $user);
            $user->tokens()->delete();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil keluar akun dari seluruh perangkat.',
        ]);
    }
}
