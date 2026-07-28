<?php

namespace App\Contracts;

use App\Models\Complaint;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ComplaintRepositoryInterface
{
    public function getAllFiltered(array $filters, int $perPage = 15): LengthAwarePaginator|Collection;

    public function findById(int $id): ?Complaint;

    public function findByTicketCode(string $ticketCode): ?Complaint;

    public function getByUserId(int $userId): Collection;

    public function create(array $data): Complaint;

    public function update(Complaint $complaint, array $data): bool;

    public function getSummaryStats(): array;

    public function findDuplicate(string $identifier, string $address, int $categoryId): ?Complaint;

    public function delete(Complaint $complaint): bool;
}
