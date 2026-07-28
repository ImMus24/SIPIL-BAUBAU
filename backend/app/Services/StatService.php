<?php

namespace App\Services;

use App\Contracts\ComplaintRepositoryInterface;

class StatService
{
    public function __construct(
        protected ComplaintRepositoryInterface $complaintRepository
    ) {}

    public function getSummary(): array
    {
        return $this->complaintRepository->getSummaryStats();
    }
}
