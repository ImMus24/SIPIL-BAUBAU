<?php

namespace App\Http\Middleware;

use Closure;
use App\Enums\UserRole;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Sesi Anda telah berakhir. Silakan login kembali.',
            ], 401);
        }

        // $user->role is UserRole backed enum — compare by value
        $roleValue = $user->role instanceof UserRole
            ? $user->role->value
            : $user->role;

        if (!in_array($roleValue, $roles, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Aksi ini hanya dapat dilakukan oleh role dengan izin yang sesuai.',
            ], 403);
        }

        return $next($request);
    }
}
