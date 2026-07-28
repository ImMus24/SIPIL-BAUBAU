<?php

namespace App\Traits;

use App\Models\AuditLog;
use App\Models\User;

trait Auditable
{
    protected function auditLog(
        string $action,
        ?string $description = null,
        mixed $previous = null,
        mixed $metadata = null,
        ?User $user = null,
    ): void {
        AuditLog::log($action, $description, $previous, $metadata, $user);
    }
}
