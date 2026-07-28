<?php

namespace App\Services;

use App\Contracts\ComplaintRepositoryInterface;
use App\Models\Complaint;

class DashboardService
{
    public function __construct(
        protected ComplaintRepositoryInterface $complaintRepository
    ) {}

    public function getAdminOverview(): array
    {
        $stats = $this->complaintRepository->getSummaryStats();
        $recentReports = $this->complaintRepository->getAllFiltered([], 5);
        $trends = $this->calculateWeeklyTrend();

        return [
            'stats' => $stats,
            'recent_reports' => $recentReports,
            'weekly_trend' => $trends,
            'active_officers' => Complaint::query()
                ->where('status', 'diproses')
                ->distinct('agency_id')
                ->count(),
        ];
    }

    public function getCitizenOverview(int $userId): array
    {
        $stats = $this->complaintRepository->getSummaryStats();
        $myReports = $this->complaintRepository->getByUserId($userId);

        return [
            'stats' => $stats,
            'my_reports' => $myReports,
        ];
    }

    protected function calculateWeeklyTrend(): array
    {
        $days = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $count = Complaint::query()->whereDate('created_at', $date)->count();

            $days[] = [
                'date' => $date,
                'count' => $count,
            ];
        }

        return $days;
    }
}
