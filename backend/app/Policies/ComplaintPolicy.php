<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Complaint;
use App\Models\User;

class ComplaintPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Complaint $complaint): bool
    {
        return true;
    }

    public function create(?User $user): bool
    {
        return true;
    }

    public function updateStatus(User $user, Complaint $complaint): bool
    {
        if ($user->isAdmin() || $user->isHeadOfAgency()) {
            return true;
        }

        // Officer can only update complaints assigned to their agency
        return $user->isOfficer()
            && $user->agency_id
            && $complaint->agency_id === $user->agency_id;
    }

    public function delete(User $user, Complaint $complaint): bool
    {
        return $user->isAdmin();
    }
}
