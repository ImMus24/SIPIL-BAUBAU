<?php

namespace App\Actions;

use App\Contracts\UserRepositoryInterface;
use App\DTOs\RegisterUserDTO;
use App\Events\UserRegistered;
use App\Models\User;
use App\Traits\Auditable;
use Illuminate\Support\Facades\Hash;

class RegisterUserAction
{
    use Auditable;

    public function __construct(
        protected UserRepositoryInterface $userRepository
    ) {}

    public function execute(RegisterUserDTO $dto): User
    {
        $user = $this->userRepository->create([
            'name' => $dto->name,
            'email' => $dto->email,
            'password' => Hash::make($dto->password),
            'role' => $dto->role,
            'phone' => $dto->phone,
        ]);

        $this->auditLog('USER_REGISTERED', "Pengguna {$user->name} ({$user->email}) mendaftar.", metadata: [
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $user->role->value,
        ], user: $user);

        return $user;
    }
}
