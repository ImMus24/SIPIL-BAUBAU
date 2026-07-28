<?php

namespace App\Services;

use App\Contracts\ComplaintRepositoryInterface;
use App\Models\User;
use App\Models\Complaint;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function __construct(
        protected ComplaintRepositoryInterface $complaintRepository
    ) {}

    public function getAdminOverview(): array
    {
        $stats = $this->complaintRepository->getSummaryStats();
        $recentReports = $this->complaintRepository->getAllFiltered([], 5);
        $monthlyTrend = $this->complaintRepository->getMonthlyTrend(6);
        $activeOfficers = User::query()
            ->where('role', 'officer')
            ->whereHas('complaints', fn($q) => $q->where('status', 'diproses'))
            ->count();
        $totalUsers = User::count();
        $totalOfficers = User::where('role', 'officer')->count();
        $totalCitizens = User::where('role', 'citizen')->count();
        $verificationQueue = $this->complaintRepository->getAllFiltered(['status' => 'menunggu'], 5);
        $topCategories = $this->complaintRepository->getTopCategories(5);
        $topSubdistricts = $this->complaintRepository->getTopSubdistricts(5);
        $officerRanking = $this->complaintRepository->getOfficerRanking(10);

        // Audit log
        $auditLog = AuditLog::with('user')
            ->latest()
            ->limit(10)
            ->get()
            ->toArray();

        // Complaint analytics
        $complaintAnalytics = [
            'by_category' => $topCategories,
            'by_subdistrict' => $topSubdistricts,
            'by_urgency' => Complaint::selectRaw('urgency, COUNT(*) as count')
                ->groupBy('urgency')
                ->pluck('count', 'urgency')
                ->toArray(),
        ];

        return [
            'stats' => $stats,
            'recent_reports' => $recentReports,
            'monthly_trend' => $monthlyTrend,
            'active_officers' => $activeOfficers,
            'agency_performance' => $this->complaintRepository->getCompletionRateByAgency(),
            'user_summary' => [
                'total' => $totalUsers,
                'officers' => $totalOfficers,
                'citizens' => $totalCitizens,
            ],
            'verification_queue' => $verificationQueue,
            'top_categories' => $topCategories,
            'top_subdistricts' => $topSubdistricts,
            'officer_ranking' => $officerRanking,
            'audit_log' => $auditLog,
            'complaint_analytics' => $complaintAnalytics,
        ];
    }

    public function getCitizenOverview(int $userId): array
    {
        $stats     = $this->complaintRepository->getCitizenStats($userId);
        $myReports = $this->complaintRepository->getByUserId($userId);

        // Build timeline from all status-log entries across the citizen's reports
        $timeline = [];
        foreach ($myReports as $report) {
            foreach ($report->statusLogs ?? [] as $log) {
                $timeline[] = [
                    'complaint_id' => $report->id,
                    'ticket_code'  => $report->ticket_code,
                    'title'        => $report->title,
                    'status'       => $log->status,
                    'notes'        => $log->notes,
                    'updated_by'   => $log->updated_by,
                    'created_at'   => $log->created_at,
                ];
            }
        }
        usort($timeline, fn($a, $b) => strtotime($b['created_at']) - strtotime($a['created_at']));

        $satisfaction = [
            'completion_rate'  => $stats['completion_rate'],
            'total_completed'  => $stats['selesai'],
            'total_reports'    => $stats['total'],
        ];

        return [
            'stats'               => $stats,
            'my_reports'          => $myReports,
            'timeline'            => array_slice($timeline, 0, 10),
            'notifications_count' => $this->getNotificationsCount($userId),
            'satisfaction'        => $satisfaction,
        ];
    }

    public function getOfficerDashboard(int $userId, ?int $agencyId): array
    {
        if (!$agencyId) {
            return [
                'stats_agency' => ['menunggu' => 0, 'diproses' => 0, 'selesai' => 0, 'ditolak' => 0],
                'todays_tasks' => ['new_today' => 0, 'in_progress' => 0, 'completed_today' => 0],
                'assigned_tasks' => collect([]),
                'recent_activity' => collect([]),
                'avg_resolution_time' => 0,
                'priority_complaints' => [],
                'performance_chart' => [],
                'assignment_history' => [],
            ];
        }

        $stats = $this->complaintRepository->getByAgencyGroupedByStatus($agencyId);
        $todaysTasks = $this->complaintRepository->getTodaysCountByAgency($agencyId);
        $assignedTasks = $this->complaintRepository->getByAgencyId($agencyId);
        $recentActivity = $this->complaintRepository->getByAgencyId($agencyId, ['status' => 'diproses']);
        $avgTime = $this->complaintRepository->getAvgResolutionTimeByAgency($agencyId);
        $priority = $this->complaintRepository->getByAgencyId($agencyId, ['status' => 'menunggu']);

        // Performance chart (last 7 days)
        $performanceChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $completed = Complaint::where('agency_id', $agencyId)
                ->where('status', 'selesai')
                ->whereDate('completed_at', $date)
                ->count();
            $new = Complaint::where('agency_id', $agencyId)
                ->whereDate('created_at', $date)
                ->count();

            $dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
            $performanceChart[] = [
                'date' => $date,
                'label' => $dayNames[(int) now()->subDays($i)->format('w')],
                'completed' => $completed,
                'new' => $new,
            ];
        }

        // Assignment history
        $assignmentHistory = Complaint::with(['category'])
            ->where('agency_id', $agencyId)
            ->where('status', '!=', 'menunggu')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'ticket_code' => $c->ticket_code,
                'title' => $c->title,
                'status' => $c->status,
                'category_name' => $c->category?->name,
                'completed_at' => $c->completed_at,
                'created_at' => $c->created_at,
            ])
            ->toArray();

        return [
            'stats_agency' => $stats,
            'todays_tasks' => $todaysTasks,
            'assigned_tasks' => $assignedTasks,
            'recent_activity' => $recentActivity,
            'avg_resolution_time' => $avgTime,
            'priority_complaints' => $priority,
            'performance_chart' => $performanceChart,
            'assignment_history' => $assignmentHistory,
        ];
    }

    public function getHeadOfAgencyDashboard(): array
    {
        $stats = $this->complaintRepository->getSummaryStats();
        $monthlyTrend = $this->complaintRepository->getMonthlyTrend(12);
        $agencyPerformance = $this->complaintRepository->getCompletionRateByAgency();
        $recentReports = $this->complaintRepository->getAllFiltered([], 10);
        $avgTime = $this->complaintRepository->getAvgResolutionTimeByAgency(null);
        $topOfficers = $this->complaintRepository->getOfficerRanking(5);
        $topCategories = $this->complaintRepository->getTopCategories(7);
        $yearlyTrend = $this->complaintRepository->getYearlyTrend(3);

        // District performance
        $districtPerformance = $this->complaintRepository->getTopSubdistricts(8);

        // Satisfaction rate
        $satisfactionRate = $stats['completion_rate'];

        return [
            'stats' => $stats,
            'monthly_trend' => $monthlyTrend,
            'agency_performance' => $agencyPerformance,
            'recent_reports' => $recentReports,
            'avg_resolution_time' => $avgTime,
            'top_officers' => $topOfficers,
            'top_categories' => $topCategories,
            'yearly_trend' => $yearlyTrend,
            'district_performance' => $districtPerformance,
            'satisfaction_rate' => $satisfactionRate,
        ];
    }

    public function getComplaintsMapData(?string $role = null, ?int $userId = null, ?int $agencyId = null): array
    {
        return $this->complaintRepository->getComplaintsMapData($role, $userId, $agencyId);
    }

    protected function getNotificationsCount(int $userId): int
    {
        return \App\Models\Notification::where('user_id', $userId)
            ->unread()
            ->count();
    }
}
