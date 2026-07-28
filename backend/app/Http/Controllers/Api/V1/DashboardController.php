<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ComplaintResource;
use App\Services\DashboardService;
use App\Traits\ApiResponseTrait;
use App\Models\ComplaintStatusLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $user->role->value;

        $data = match ($role) {
            'admin' => $this->adminDashboardData(),
            'officer' => $this->officerDashboardData($user),
            'head_of_agency' => $this->headDashboardData(),
            default => $this->citizenDashboardData($user),
        };

        return $this->success($data, 'Data dashboard berhasil dimuat.');
    }

    public function citizenDashboard(Request $request): JsonResponse
    {
        return $this->success(
            $this->citizenDashboardData($request->user()),
            'Data dashboard warga berhasil dimuat.'
        );
    }

    public function officerDashboard(Request $request): JsonResponse
    {
        return $this->success(
            $this->officerDashboardData($request->user()),
            'Data dashboard petugas berhasil dimuat.'
        );
    }

    public function adminDashboard(Request $request): JsonResponse
    {
        return $this->success(
            $this->adminDashboardData(),
            'Data dashboard admin berhasil dimuat.'
        );
    }

    public function headDashboard(Request $request): JsonResponse
    {
        return $this->success(
            $this->headDashboardData(),
            'Data dashboard kepala dinas berhasil dimuat.'
        );
    }

    public function mapData(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $user->role->value;
        $data = $this->dashboardService->getComplaintsMapData(
            $role,
            $user->id,
            $user->agency_id
        );
        return $this->success($data, 'Data peta berhasil dimuat.');
    }

    public function quickSearch(Request $request): JsonResponse
    {
        $search = trim(strip_tags($request->input('q', '')));
        if (strlen($search) < 2) {
            return $this->success([], 'Masukkan minimal 2 karakter.');
        }

        $complaints = ComplaintResource::collection(
            app(\App\Contracts\ComplaintRepositoryInterface::class)
                ->getAllFiltered(['search' => $search], 10)
        );

        return $this->success($complaints, 'Hasil pencarian.');
    }

    public function activities(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $user->role->value;

        $query = ComplaintStatusLog::with(['complaint', 'complaint.category'])
            ->latest()
            ->limit(10);

        // Filter by role
        if ($role === 'citizen') {
            $query->whereHas('complaint', fn($q) => $q->where('user_id', $user->id));
        } elseif ($role === 'officer' && $user->agency_id) {
            $query->whereHas('complaint', fn($q) => $q->where('agency_id', $user->agency_id));
        }

        $activities = $query->get()->map(fn($log) => [
            'id' => $log->id,
            'complaint_id' => $log->complaint_id,
            'ticket_code' => $log->complaint?->ticket_code,
            'title' => $log->complaint?->title,
            'category_name' => $log->complaint?->category?->name,
            'status' => $log->status,
            'notes' => $log->notes,
            'updated_by' => $log->updated_by,
            'created_at' => $log->created_at,
        ]);

        return $this->success($activities, 'Aktivitas terbaru berhasil dimuat.');
    }

    protected function citizenDashboardData($user): array
    {
        $overview = $this->dashboardService->getCitizenOverview($user->id);
        return [
            'stats' => $overview['stats'],
            'my_reports' => ComplaintResource::collection($overview['my_reports']),
            'user_complaints' => ComplaintResource::collection($overview['user_complaints']),
            'timeline' => $overview['timeline'],
            'notifications_count' => $overview['notifications_count'],
            'satisfaction' => $overview['satisfaction'],
        ];
    }

    protected function officerDashboardData($user): array
    {
        $dashboard = $this->dashboardService->getOfficerDashboard(
            $user->id,
            $user->agency_id
        );
        return [
            'stats_agency' => $dashboard['stats_agency'],
            'todays_tasks' => $dashboard['todays_tasks'],
            'assigned_tasks' => ComplaintResource::collection($dashboard['assigned_tasks']),
            'recent_activity' => $dashboard['recent_activity'],
            'avg_resolution_time' => $dashboard['avg_resolution_time'],
            'priority_complaints' => ComplaintResource::collection($dashboard['priority_complaints']),
            'performance_chart' => $dashboard['performance_chart'],
            'assignment_history' => $dashboard['assignment_history'],
        ];
    }

    protected function adminDashboardData(): array
    {
        $overview = $this->dashboardService->getAdminOverview();
        return [
            'stats' => $overview['stats'],
            'recent_reports' => ComplaintResource::collection($overview['recent_reports']),
            'monthly_trend' => $overview['monthly_trend'],
            'active_officers' => $overview['active_officers'],
            'agency_performance' => $overview['agency_performance'],
            'user_summary' => $overview['user_summary'],
            'verification_queue' => ComplaintResource::collection($overview['verification_queue']),
            'top_categories' => $overview['top_categories'],
            'top_subdistricts' => $overview['top_subdistricts'],
            'officer_ranking' => $overview['officer_ranking'],
            'audit_log' => $overview['audit_log'],
            'complaint_analytics' => $overview['complaint_analytics'],
        ];
    }

    protected function headDashboardData(): array
    {
        $dashboard = $this->dashboardService->getHeadOfAgencyDashboard();
        return [
            'stats' => $dashboard['stats'],
            'monthly_trend' => $dashboard['monthly_trend'],
            'agency_performance' => $dashboard['agency_performance'],
            'recent_reports' => ComplaintResource::collection($dashboard['recent_reports']),
            'avg_resolution_time' => $dashboard['avg_resolution_time'],
            'top_officers' => $dashboard['top_officers'],
            'top_categories' => $dashboard['top_categories'],
            'yearly_trend' => $dashboard['yearly_trend'],
            'district_performance' => $dashboard['district_performance'],
            'satisfaction_rate' => $dashboard['satisfaction_rate'],
        ];
    }
}
