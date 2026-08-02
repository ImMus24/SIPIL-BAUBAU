<?php

namespace App\Repositories;

use App\Contracts\ComplaintRepositoryInterface;
use App\Models\Complaint;
use App\Models\ComplaintStatusLog;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ComplaintRepository implements ComplaintRepositoryInterface
{
    // ──────────────────────────────────────────────────────────────
    // Core CRUD
    // ──────────────────────────────────────────────────────────────

    public function create(array $data): Complaint
    {
        return Complaint::create($data);
    }

    public function update(Complaint $complaint, array $data): bool
    {
        return $complaint->update($data);
    }

    public function delete(Complaint $complaint): bool
    {
        return $complaint->delete();
    }

    public function getTimelineByAgency(int $agencyId, int $limit = 15): array
    {
        return ComplaintStatusLog::with(['complaint:id,ticket_code,title'])
            ->whereHas('complaint', fn($q) => $q->where('agency_id', $agencyId))
            ->latest()
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function getCompletedCountThisMonth(int $agencyId): int
    {
        return Complaint::where('agency_id', $agencyId)
            ->where('status', 'selesai')
            ->whereMonth('completed_at', now()->month)
            ->whereYear('completed_at', now()->year)
            ->count();
    }

    // ──────────────────────────────────────────────────────────────
    // Queries
    // ──────────────────────────────────────────────────────────────

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

    public function findWithDetail(int $id): ?Complaint
    {
        return Complaint::with([
            'category',
            'agency',
            'attachments',
            'statusLogs',
            'comments.user',
            'activityLogs.user',
            'files.uploader',
            'notifications',
        ])->find($id);
    }

    public function getRelated(int $id, int $categoryId, string $subdistrict, int $limit = 6): Collection
    {
        return Complaint::with(['category', 'agency'])
            ->where('id', '!=', $id)
            ->where(function ($q) use ($categoryId, $subdistrict) {
                $q->where('category_id', $categoryId)
                  ->orWhere('subdistrict', $subdistrict);
            })
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getNotificationHistory(int $id, int $limit = 20): Collection
    {
        return \App\Models\Notification::query()
            ->where('data->complaint_id', $id)
            ->latest()
            ->limit($limit)
            ->get();
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

    // ──────────────────────────────────────────────────────────────
    // Stats & Aggregates
    // ──────────────────────────────────────────────────────────────

    /**
     * Global complaint counts — cached for 60 s.
     * Cache is tagged so it can be flushed on status change if needed.
     */
    public function getSummaryStats(): array
    {
        return Cache::remember('stats_summary', 60, function () {
            $row = DB::table('complaints')->selectRaw("
                COUNT(*) as total,
                SUM(CASE WHEN status = 'menunggu' THEN 1 ELSE 0 END) as menunggu,
                SUM(CASE WHEN status = 'diproses' THEN 1 ELSE 0 END) as diproses,
                SUM(CASE WHEN status = 'selesai'  THEN 1 ELSE 0 END) as selesai,
                SUM(CASE WHEN status = 'ditolak'  THEN 1 ELSE 0 END) as ditolak
            ")->first();

            $total      = (int) ($row->total    ?? 0);
            $selesai    = (int) ($row->selesai   ?? 0);

            return [
                'total'           => $total,
                'menunggu'        => (int) ($row->menunggu ?? 0),
                'diproses'        => (int) ($row->diproses ?? 0),
                'selesai'         => $selesai,
                'ditolak'         => (int) ($row->ditolak  ?? 0),
                'completion_rate' => $total > 0 ? round(($selesai / $total) * 100, 1) : 0,
            ];
        });
    }

    /**
     * Per-citizen complaint counts (used by citizen dashboard KPI cards).
     */
    public function getCitizenStats(int $userId): array
    {
        $row = DB::table('complaints')
            ->where('user_id', $userId)
            ->selectRaw("
                COUNT(*) as total,
                SUM(CASE WHEN status = 'menunggu' THEN 1 ELSE 0 END) as menunggu,
                SUM(CASE WHEN status = 'diproses' THEN 1 ELSE 0 END) as diproses,
                SUM(CASE WHEN status = 'selesai'  THEN 1 ELSE 0 END) as selesai,
                SUM(CASE WHEN status = 'ditolak'  THEN 1 ELSE 0 END) as ditolak
            ")
            ->first();

        $total   = (int) ($row->total   ?? 0);
        $selesai = (int) ($row->selesai ?? 0);

        return [
            'total'           => $total,
            'menunggu'        => (int) ($row->menunggu ?? 0),
            'diproses'        => (int) ($row->diproses ?? 0),
            'selesai'         => $selesai,
            'ditolak'         => (int) ($row->ditolak  ?? 0),
            'completion_rate' => $total > 0 ? round(($selesai / $total) * 100, 1) : 0,
        ];
    }

    public function getByAgencyGroupedByStatus(int $agencyId): array
    {
        $grouped = DB::table('complaints')
            ->selectRaw("status, COUNT(*) as total")
            ->where('agency_id', $agencyId)
            ->groupBy('status')
            ->pluck('total', 'status');

        return [
            'menunggu' => (int) ($grouped['menunggu'] ?? 0),
            'diproses' => (int) ($grouped['diproses'] ?? 0),
            'selesai'  => (int) ($grouped['selesai']  ?? 0),
            'ditolak'  => (int) ($grouped['ditolak']  ?? 0),
        ];
    }

    /**
     * Monthly trend — single GROUP BY query instead of N loop queries.
     */
    public function getMonthlyTrend(int $months = 6): array
    {
        $indonesianMonths = [
            1 => 'Januari',  2 => 'Februari', 3 => 'Maret',    4 => 'April',
            5 => 'Mei',      6 => 'Juni',      7 => 'Juli',      8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        // Pre-fill buckets to guarantee all months appear even with zero data
        $buckets = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $date  = now()->subMonths($i);
            $key   = $date->format('Y-m');
            $label = ($indonesianMonths[(int) $date->format('n')] ?? $date->format('F'))
                   . ' ' . $date->format('Y');
            $buckets[$key] = ['month' => $key, 'label' => $label, 'total' => 0, 'resolved' => 0];
        }

        $from      = now()->subMonths($months - 1)->startOfMonth();
        $driver    = DB::getDriverName();
        $dateExpr  = $driver === 'sqlite'
            ? "strftime('%Y-%m', created_at)"
            : "DATE_FORMAT(created_at, '%Y-%m')";

        $rows = DB::table('complaints')
            ->selectRaw("{$dateExpr} as month_key,
                COUNT(*) as total,
                SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as resolved")
            ->where('created_at', '>=', $from)
            ->groupByRaw($dateExpr)
            ->get()
            ->keyBy('month_key');

        foreach ($buckets as $key => &$bucket) {
            if ($rows->has($key)) {
                $bucket['total']    = (int) $rows[$key]->total;
                $bucket['resolved'] = (int) $rows[$key]->resolved;
            }
        }

        return array_values($buckets);
    }

    /**
     * Yearly trend — single GROUP BY query instead of N loop queries.
     */
    public function getYearlyTrend(int $years = 3): array
    {
        $currentYear = now()->year;
        $startYear   = $currentYear - $years + 1;

        // Pre-fill buckets
        $buckets = [];
        for ($y = $startYear; $y <= $currentYear; $y++) {
            $buckets[(string) $y] = ['year' => (string) $y, 'total' => 0, 'resolved' => 0];
        }

        $driver   = DB::getDriverName();
        $yearExpr = $driver === 'sqlite'
            ? "CAST(strftime('%Y', created_at) AS INTEGER)"
            : "YEAR(created_at)";

        $rows = DB::table('complaints')
            ->selectRaw("{$yearExpr} as year_key,
                COUNT(*) as total,
                SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as resolved")
            ->whereRaw("{$yearExpr} >= ?", [$startYear])
            ->groupByRaw($yearExpr)
            ->get()
            ->keyBy('year_key');

        foreach ($buckets as $year => &$bucket) {
            if ($rows->has($year)) {
                $bucket['total']    = (int) $rows[$year]->total;
                $bucket['resolved'] = (int) $rows[$year]->resolved;
            }
        }

        return array_values($buckets);
    }

    public function getCompletionRateByAgency(): array
    {
        return DB::table('complaints')
            ->join('agencies', 'complaints.agency_id', '=', 'agencies.id')
            ->whereNotNull('complaints.agency_id')
            ->selectRaw("
                agencies.name as agency_name,
                COUNT(complaints.id) as total,
                SUM(CASE WHEN complaints.status = 'selesai' THEN 1 ELSE 0 END) as resolved
            ")
            ->groupBy('agencies.id', 'agencies.name')
            ->get()
            ->map(fn($item) => [
                'agency_name'     => $item->agency_name,
                'total'           => (int) $item->total,
                'resolved'        => (int) $item->resolved,
                'completion_rate' => $item->total > 0
                    ? round(($item->resolved / $item->total) * 100, 1)
                    : 0,
            ])
            ->toArray();
    }

    /**
     * Today's task counts for an agency — consolidated to a single aggregate query.
     */
    public function getTodaysCountByAgency(int $agencyId): array
    {
        $today = today()->toDateString();

        $row = DB::table('complaints')
            ->where('agency_id', $agencyId)
            ->selectRaw("
                SUM(CASE WHEN DATE(created_at) = ? THEN 1 ELSE 0 END) as new_today,
                SUM(CASE WHEN status = 'diproses' THEN 1 ELSE 0 END) as in_progress,
                SUM(CASE WHEN status = 'selesai' AND DATE(completed_at) = ? THEN 1 ELSE 0 END) as completed_today
            ", [$today, $today])
            ->first();

        return [
            'new_today'       => (int) ($row->new_today       ?? 0),
            'in_progress'     => (int) ($row->in_progress     ?? 0),
            'completed_today' => (int) ($row->completed_today ?? 0),
        ];
    }

    public function getAvgResolutionTimeByAgency(?int $agencyId): float
    {
        $query = Complaint::where('status', 'selesai')
            ->whereNotNull('completed_at');

        if ($agencyId) {
            $query->where('agency_id', $agencyId);
        }

        $driver = DB::getDriverName();
        // SQLite: julianday diff × 24; MySQL: TIMESTAMPDIFF
        $expr = $driver === 'sqlite'
            ? "AVG((julianday(completed_at) - julianday(created_at)) * 24)"
            : "AVG(TIMESTAMPDIFF(HOUR, created_at, completed_at))";

        $avg = $query
            ->selectRaw("{$expr} as avg_hours")
            ->first()
            ->avg_hours ?? 0;

        return round((float) $avg, 1);
    }

    public function getTopCategories(int $limit = 5): array
    {
        return DB::table('complaints')
            ->join('categories', 'complaints.category_id', '=', 'categories.id')
            ->selectRaw('categories.name as category_name, COUNT(complaints.id) as count')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('count')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function getTopSubdistricts(int $limit = 5): array
    {
        return DB::table('complaints')
            ->selectRaw("
                subdistrict,
                COUNT(*) as count,
                SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as resolved
            ")
            ->groupBy('subdistrict')
            ->orderByDesc('count')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Officer ranking based on complaints handled by each officer's agency.
     * Joins via users.agency_id = complaints.agency_id (not complaints.user_id).
     */
    public function getOfficerRanking(int $limit = 10): array
    {
        return DB::table('complaints')
            ->join('agencies', 'agencies.id', '=', 'complaints.agency_id')
            ->join('users', 'users.agency_id', '=', 'complaints.agency_id')
            ->where('users.role', 'officer')
            ->whereNotNull('complaints.agency_id')
            ->selectRaw("
                users.id as officer_id,
                users.name as officer_name,
                agencies.name as agency_name,
                COUNT(complaints.id) as total_handled,
                SUM(CASE WHEN complaints.status = 'selesai' THEN 1 ELSE 0 END) as completed
            ")
            ->groupBy('users.id', 'users.name', 'agencies.id', 'agencies.name')
            ->orderByDesc('completed')
            ->limit($limit)
            ->get()
            ->toArray();
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
}
