<?php

namespace App\Services;

use App\Contracts\UserRepositoryInterface;
use App\Models\AuditLog;
use App\Models\User;

class UserService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository
    ) {}

    public function getAllUsers(array $filters = [], int $perPage = 15): mixed
    {
        return $this->userRepository->getAllFiltered($filters, $perPage);
    }

    public function getUserById(int $id): ?User
    {
        return $this->userRepository->findById($id);
    }

    public function updateUser(int $id, array $data): User
    {
        $user = $this->userRepository->findById($id);
        abort_unless($user, 404, 'Pengguna tidak ditemukan.');

        $this->userRepository->update($user, $data);

        AuditLog::log('USER_UPDATED', "Data pengguna {$user->name} diperbarui.", null, [
            'user_id' => $user->id,
            'updated_fields' => array_keys($data),
        ], $user);

        return $user->fresh();
    }

    public function deleteUser(int $id): void
    {
        $user = $this->userRepository->findById($id);
        abort_unless($user, 404, 'Pengguna tidak ditemukan.');

        AuditLog::log('USER_DELETED', "Pengguna {$user->name} dihapus.", null, [
            'user_id' => $user->id,
        ]);

        $user->delete();
    }
}
