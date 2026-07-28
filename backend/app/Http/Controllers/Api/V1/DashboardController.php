<?php

namespace App\Http\Controllers\Api\V1;

use App\Contracts\ComplaintRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Resources\ComplaintResource;
use App\Models\ComplaintStatusLog;
use App\Services\DashboardService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    /**
     * Route to role-specific dashboard based on authenticated user role.
     */
    public function index(Request $request): JsonResponse
    {
        return match ($request->user()->role->value) {
            'admin'          => $this->adminDashboard($request),
            'officer'        => $this->officerDashboard($request),
            'head_of_agency' => $this->headDashboard($request),
            default          => $this->citizenDashboard($request),
        };
    }

    public function citizenDashboard(Request $request): JsonResponse
    {
        $overview = $this->dashboardService->getCitizenOverview($request->user()->id);

        return $this->success([
            'stats'               => $overview['stats'],
            'my_reports'          => ComplaintResource::collection($overview['my_reports']),
            'timeline'            => $overview['timeline'],
            'notifications_count' => $overview['notifications_count'],
            'satisfaction'        => $overview['satisfaction'],
        ], 'Data dashboard warga berhasil dimuat.');
    }

    public function officerDashboard(Request $request): JsonResponse
    {
        $user      = $request->user();
        $dashboard = $this->dashboardService->getOfficerDashboard($user->id, $user->agency_id);

        return $this->success([
            'stats_agency'        => $dashboard['stats_agency'],
            'todays_tasks'        => $dashboard['todays_tasks'],
            'assigned_tasks'      => ComplaintResource::collection($dashboard['assigned_tasks']),
            'recent_activity'     => ComplaintResource::collection($dashboard['recent_activity']),
            'avg_resolution_time' => $dashboard['avg_resolution_time'],
            'priority_complaints' => ComplaintResource::collection($dashboard['priority_complaints']),
            'performance_chart'   => $dashboard['performance_chart'],
            'assignment_history'  => $dashboard['assignment_history'],
        ], 'Data dashboard petugas berhasil dimuat.');
    }

    public function adminDashboard(Request $request): JsonResponse
    {
        $overview = $this->dashboardService->getAdminOverview();

        return $this->success([
            'stats'               => $overview['stats'],
            'recent_reports'      => ComplaintResource::collection($overview['recent_reports']),
            'monthly_trend'       => $overview['monthly_trend'],
            'active_officers'     => $overview['active_officers'],
            'agency_performance'  => $overview['agency_performance'],
            'user_summary'        => $overview['user_summary'],
            'verification_queue'  => ComplaintResource::collection($overview['verification_queue']),
            'top_categories'      => $overview['top_categories'],
            'top_subdistricts'    => $overview['top_subdistricts'],
            'officer_ranking'     => $overview['officer_ranking'],
            'audit_log'           => $overview['audit_log'],
            'complaint_analytics' => $overview['complaint_analytics'],
        ], 'Data dashboard admin berhasil dimuat.');
    }

    public function headDashboard(Request $request): JsonResponse
    {
        $dashboard = $this->dashboardService->getHeadOfAgencyDashboard();

        return $this->success([
            'stats'                => $dashboard['stats'],
            'monthly_trend'        => $dashboard['monthly_trend'],
            'agency_performance'   => $dashboard['agency_performance'],
            'recent_reports'       => ComplaintResource::collection($dashboard['recent_reports']),
            'avg_resolution_time'  => $dashboard['avg_resolution_time'],
            'top_officers'         => $dashboard['top_officers'],
            'top_categories'       => $dashboard['top_categories'],
            'yearly_trend'         => $dashboard['yearly_trend'],
            'district_performance' => $dashboard['district_performance'],
            'satisfaction_rate'    => $dashboard['satisfaction_rate'],
        ], 'Data dashboard kepala dinas berhasil dimuat.');
    }

    public function mapData(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = $this->dashboardService->getComplaintsMapData(
            $user->role->value,
            $user->id,
            $user->agency_id,
        );

        return $this->success($data, 'Data peta berhasil dimuat.');
    }

    public function quickSearch(Request $request): JsonResponse
    {
        $search = trim(strip_tags($request->input('q', '')));

        if (strlen($search) < 2) {
            return $this->success([], 'Masukkan minimal 2 karakter.');
        }

        return $this->success(
            ComplaintResource::collection(
                app(ComplaintRepositoryInterface::class)->getAllFiltered(['search' => $search], 10)
            ),
            'Hasil pencarian.'
        );
    }

    public function activities(Request $request): JsonResponse
    {
        $user  = $request->user();
        $role  = $user->role->value;

        $query = ComplaintStatusLog::with(['complaint', 'complaint.category'])
            ->latest()
            ->limit(10);

        if ($role === 'citizen') {
            $query->whereHas('complaint', fn($q) => $q->where('user_id', $user->id));
        } elseif ($role === 'officer' && $user->agency_id) {
            $query->whereHas('complaint', fn($q) => $q->where('agency_id', $user->agency_id));
        }

        $activities = $query->get()->map(fn($log) => [
            'id'            => $log->id,
            'complaint_id'  => $log->complaint_id,
            'ticket_code'   => $log->complaint?->ticket_code,
            'title'         => $log->complaint?->title,
            'category_name' => $log->complaint?->category?->name,
            'status'        => $log->status,
            'notes'         => $log->notes,
            'updated_by'    => $log->updated_by,
            'created_at'    => $log->created_at,
        ]);

        return $this->success($activities, 'Aktivitas terbaru berhasil dimuat.');
    }
}
