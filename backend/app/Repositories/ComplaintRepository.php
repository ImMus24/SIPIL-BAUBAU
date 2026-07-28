<?php

namespace App\Repositories;

use App\Contracts\ComplaintRepositoryInterface;
use App\Models\Complaint;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ComplaintRepository implements ComplaintRepositoryInterface
{
    public function getAllFiltered(array $filters, int $perPage = 15): LengthAwarePaginator|Collection
    {
        $query = Complaint::with(['category', 'agency', 'attachments', 'statusLogs']);

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['category_id']) && $filters['category_id'] !== 'all') {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['subdistrict']) && $filters['subdistrict'] !== 'all') {
            $query->where('subdistrict', $filters['subdistrict']);
        }

        if (!empty($filters['urgency']) && $filters['urgency'] !== 'all') {
            $query->where('urgency', $filters['urgency']);
        }

        if (!empty($filters['agency_id'])) {
            $query->where('agency_id', $filters['agency_id']);
        }

        if (!empty($filters['search'])) {
            $q = trim(strip_tags($filters['search']));
            $query->where(function ($sub) use ($q) {
                $sub->where('title', 'like', "%{$q}%")
                    ->orWhere('ticket_code', 'like', "%{$q}%")
                    ->orWhere('address', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            });
        }

        if (!empty($filters['paginate']) && $filters['paginate'] === true) {
            return $query->latest()->paginate($perPage);
        }

        return $query->latest()->get();
    }

    public function findById(int $id): ?Complaint
    {
        return Complaint::with(['category', 'agency', 'attachments', 'statusLogs'])->find($id);
    }

    public function findByTicketCode(string $ticketCode): ?Complaint
    {
        return Complaint::with(['category', 'agency', 'attachments', 'statusLogs'])
            ->where('ticket_code', strtoupper(trim($ticketCode)))
            ->first();
    }

    public function getByUserId(int $userId): Collection
    {
        return Complaint::with(['category', 'agency', 'attachments', 'statusLogs'])
            ->where('user_id', $userId)
            ->latest()
            ->get();
    }

    public function getByAgencyId(int $agencyId, array $filters = []): Collection
    {
        $query = Complaint::with(['category', 'agency', 'attachments', 'statusLogs'])
            ->where('agency_id', $agencyId);

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->get();
    }

    public function getByAgencyGroupedByStatus(int $agencyId): array
    {
        $grouped = Complaint::selectRaw('status, COUNT(*) as total')
            ->where('agency_id', $agencyId)
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        return [
            'menunggu' => $grouped['menunggu'] ?? 0,
            'diproses' => $grouped['diproses'] ?? 0,
            'selesai' => $grouped['selesai'] ?? 0,
            'ditolak' => $grouped['ditolak'] ?? 0,
        ];
    }

    public function getMonthlyTrend(int $months = 6): array
    {
        $indonesianMonths = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        $trends = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $month = $date->format('Y-m');
            $monthName = $indonesianMonths[(int) $date->format('n')] ?? $date->format('F');
            $label = $monthName . ' ' . $date->format('Y');

            $stats = Complaint::selectRaw(
                "COUNT(*) as total, SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as resolved"
            )->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->first();

            $trends[] = [
                'month' => $month,
                'label' => $label,
                'total' => (int) ($stats->total ?? 0),
                'resolved' => (int) ($stats->resolved ?? 0),
            ];
        }

        return $trends;
    }

    public function getCompletionRateByAgency(): array
    {
        return Complaint::select([
            'agencies.name as agency_name',
            DB::raw('COUNT(complaints.id) as total'),
            DB::raw("SUM(CASE WHEN complaints.status = 'selesai' THEN 1 ELSE 0 END) as resolved"),
        ])
            ->join('agencies', 'complaints.agency_id', '=', 'agencies.id')
            ->whereNotNull('complaints.agency_id')
            ->groupBy('agencies.id', 'agencies.name')
            ->get()
            ->map(function ($item) {
                return [
                    'agency_name' => $item->agency_name,
                    'total' => (int) $item->total,
                    'resolved' => (int) $item->resolved,
                    'completion_rate' => $item->total > 0
                        ? round(($item->resolved / $item->total) * 100, 1)
                        : 0,
                ];
            })
            ->toArray();
    }

    public function getTodaysCountByAgency(int $agencyId): array
    {
        $today = now()->format('Y-m-d');

        $new = Complaint::where('agency_id', $agencyId)
            ->whereDate('created_at', $today)
            ->count();

        $inProgress = Complaint::where('agency_id', $agencyId)
            ->where('status', 'diproses')
            ->count();

        $completed = Complaint::where('agency_id', $agencyId)
            ->where('status', 'selesai')
            ->whereDate('completed_at', $today)
            ->count();

        return [
            'new_today' => $new,
            'in_progress' => $inProgress,
            'completed_today' => $completed,
        ];
    }

    public function create(array $data): Complaint
    {
        return Complaint::create($data);
    }

    public function update(Complaint $complaint, array $data): bool
    {
        return $complaint->update($data);
    }

    public function getSummaryStats(): array
    {
        $total = Complaint::count();
        $menunggu = Complaint::where('status', 'menunggu')->count();
        $diproses = Complaint::where('status', 'diproses')->count();
        $selesai = Complaint::where('status', 'selesai')->count();
        $ditolak = Complaint::where('status', 'ditolak')->count();

        $completionRate = $total > 0 ? round(($selesai / $total) * 100, 1) : 0;

        return [
            'total' => $total,
            'menunggu' => $menunggu,
            'diproses' => $diproses,
            'selesai' => $selesai,
            'ditolak' => $ditolak,
            'completion_rate' => $completionRate,
        ];
    }

    public function findDuplicate(string $identifier, string $address, int $categoryId): ?Complaint
    {
        return Complaint::query()
            ->where(function ($q) use ($identifier) {
                $q->where('reporter_email', $identifier)
                  ->orWhere('reporter_phone', $identifier);
            })
            ->where('address', $address)
            ->where('category_id', $categoryId)
            ->where('created_at', '>=', now()->subHours(24))
            ->first();
    }

    public function getByUserIdWithTimeline(int $userId): Collection
    {
        return Complaint::with(['category', 'agency', 'attachments', 'statusLogs'])
            ->where('user_id', $userId)
            ->latest()
            ->get();
    }

    public function getAvgResolutionTimeByAgency(?int $agencyId): float
    {
        $query = Complaint::where('status', 'selesai')
            ->whereNotNull('completed_at');

        if ($agencyId) {
            $query->where('agency_id', $agencyId);
        }

        $avg = $query->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, completed_at)) as avg_hours')
            ->first()
            ->avg_hours ?? 0;

        return round((float) $avg, 1);
    }

    public function getTopCategories(int $limit = 5): array
    {
        return Complaint::select([
            'categories.name as category_name',
            DB::raw('COUNT(complaints.id) as count'),
        ])
            ->join('categories', 'complaints.category_id', '=', 'categories.id')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('count')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function getTopSubdistricts(int $limit = 5): array
    {
        return Complaint::select([
            'subdistrict',
            DB::raw('COUNT(*) as count'),
            DB::raw("SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as resolved"),
        ])
            ->groupBy('subdistrict')
            ->orderByDesc('count')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function getOfficerRanking(int $limit = 10): array
    {
        return Complaint::select([
            'users.name as officer_name',
            'users.id as officer_id',
            'agencies.name as agency_name',
            DB::raw('COUNT(complaints.id) as total_handled'),
            DB::raw("SUM(CASE WHEN complaints.status = 'selesai' THEN 1 ELSE 0 END) as completed"),
        ])
            ->join('users', 'complaints.user_id', '=', 'users.id')
            ->join('agencies', 'complaints.agency_id', '=', 'agencies.id')
            ->where('users.role', 'officer')
            ->groupBy('users.id', 'users.name', 'agencies.name')
            ->orderByDesc('completed')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function getYearlyTrend(int $years = 3): array
    {
        $trends = [];
        $currentYear = (int) now()->format('Y');

        for ($y = $currentYear - $years + 1; $y <= $currentYear; $y++) {
            $stats = Complaint::selectRaw(
                "COUNT(*) as total, SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as resolved"
            )->whereYear('created_at', $y)
                ->first();

            $trends[] = [
                'year' => (string) $y,
                'total' => (int) ($stats->total ?? 0),
                'resolved' => (int) ($stats->resolved ?? 0),
            ];
        }

        return $trends;
    }

    public function getNotificationsCount(int $userId): int
    {
        // Placeholder — can be connected to a notifications table later
        return 0;
    }

    public function getComplaintsMapData(?string $role = null, ?int $userId = null, ?int $agencyId = null): array
    {
        $query = Complaint::select([
            'id', 'ticket_code', 'title', 'latitude', 'longitude',
            'status', 'subdistrict', 'urgency', 'created_at',
        ]);

        if ($role === 'citizen' && $userId) {
            $query->where('user_id', $userId);
        } elseif ($role === 'officer' && $agencyId) {
            $query->where('agency_id', $agencyId);
        }

        return $query->latest()->limit(200)->get()->toArray();
    }

    public function delete(Complaint $complaint): bool
    {
        return $complaint->delete();
    }
}
