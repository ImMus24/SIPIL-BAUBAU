<?php

namespace App\Services;

use App\Actions\CreateComplaintAction;
use App\Actions\UpdateComplaintStatusAction;
use App\Contracts\ComplaintRepositoryInterface;
use App\DTOs\StoreComplaintDTO;
use App\DTOs\UpdateComplaintStatusDTO;
use App\Models\Complaint;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ComplaintService
{
    public function __construct(
        protected ComplaintRepositoryInterface $complaintRepository,
        protected CreateComplaintAction $createComplaintAction,
        protected UpdateComplaintStatusAction $updateComplaintStatusAction,
    ) {}

    public function getComplaints(array $filters): LengthAwarePaginator|Collection
    {
        return $this->complaintRepository->getAllFiltered($filters);
    }

    public function getComplaintById(int $id): ?Complaint
    {
        return $this->complaintRepository->findById($id);
    }

    public function getComplaintByTicket(string $ticketCode): ?Complaint
    {
        return $this->complaintRepository->findByTicketCode($ticketCode);
    }

    public function getComplaintsByUser(int $userId): Collection
    {
        return $this->complaintRepository->getByUserId($userId);
    }

    public function createComplaint(StoreComplaintDTO $dto): Complaint
    {
        return $this->createComplaintAction->execute($dto);
    }

    public function updateStatus(UpdateComplaintStatusDTO $dto): Complaint
    {
        return $this->updateComplaintStatusAction->execute($dto);
    }
}
