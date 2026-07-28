<?php

namespace App\Repositories;

use App\Contracts\ComplaintRepositoryInterface;
use App\Models\Complaint;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

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
}
