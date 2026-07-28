<?php

namespace App\Actions;

use App\Models\User;
use App\Models\AuditLog;
use App\Traits\Auditable;

class LogoutUserAction
{
    use Auditable;

    public function execute(?User $user): void
    {
        if (!$user) {
            return;
        }

        $this->auditLog('USER_LOGGED_OUT', "Pengguna {$user->name} logout.", user: $user);

        $user->tokens()->delete();
    }
}
