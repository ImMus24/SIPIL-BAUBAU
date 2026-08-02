<?php

namespace App\Contracts;

use App\Models\Complaint;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ComplaintRepositoryInterface
{
    public function getAllFiltered(array $filters, int $perPage = 15): LengthAwarePaginator|Collection;

    public function findById(int $id): ?Complaint;

    public function findWithDetail(int $id): ?Complaint;

    public function getRelated(int $id, int $categoryId, string $subdistrict, int $limit = 6): Collection;

    public function getNotificationHistory(int $id, int $limit = 20): Collection;

    public function findByTicketCode(string $ticketCode): ?Complaint;

    public function getByUserId(int $userId): Collection;

    public function getByAgencyId(int $agencyId, array $filters = []): Collection;

    public function getByAgencyGroupedByStatus(int $agencyId): array;

    public function getSummaryStats(): array;

    /** Per-citizen aggregate counts (for citizen dashboard KPI cards). */
    public function getCitizenStats(int $userId): array;

    public function getMonthlyTrend(int $months = 6): array;

    public function getYearlyTrend(int $years = 3): array;

    public function getCompletionRateByAgency(): array;

    public function getTodaysCountByAgency(int $agencyId): array;

    public function getAvgResolutionTimeByAgency(?int $agencyId): float;

    public function getTopCategories(int $limit = 5): array;

    public function getTopSubdistricts(int $limit = 5): array;

    public function getOfficerRanking(int $limit = 10): array;

    public function findDuplicate(string $identifier, string $address, int $categoryId): ?Complaint;

    public function getComplaintsMapData(?string $role = null, ?int $userId = null, ?int $agencyId = null): array;

    public function create(array $data): Complaint;

    public function update(Complaint $complaint, array $data): bool;

    public function getTimelineByAgency(int $agencyId, int $limit = 15): array;

    public function getCompletedCountThisMonth(int $agencyId): int;

    public function delete(Complaint $complaint): bool;
}
