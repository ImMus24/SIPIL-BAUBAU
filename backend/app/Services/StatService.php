<?php

namespace App\Services;

use App\Contracts\ComplaintRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class StatService
{
    public function __construct(
        protected ComplaintRepositoryInterface $complaintRepository
    ) {}

    public function getSummary(): array
    {
        return Cache::remember('stats_summary', 300, function () {
            return $this->complaintRepository->getSummaryStats();
        });
    }
}
