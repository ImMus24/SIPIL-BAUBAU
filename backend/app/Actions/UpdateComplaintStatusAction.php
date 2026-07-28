<?php

namespace App\Actions;

use App\Contracts\ComplaintRepositoryInterface;
use App\DTOs\UpdateComplaintStatusDTO;
use App\Events\ComplaintStatusUpdated;
use App\Exceptions\ComplaintNotFoundException;
use App\Exceptions\InvalidStatusTransitionException;
use App\Models\Complaint;
use App\Models\ComplaintStatusLog;
use App\Traits\Auditable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UpdateComplaintStatusAction
{
    use Auditable;

    public function __construct(
        protected ComplaintRepositoryInterface $complaintRepository
    ) {}

    public function execute(UpdateComplaintStatusDTO $dto): Complaint
    {
        return DB::transaction(function () use ($dto) {
            $complaint = $this->complaintRepository->findById($dto->complaintId);
            if (!$complaint) {
                throw new ComplaintNotFoundException();
            }

            $this->validateTransition($complaint->status, $dto->status);

            $oldStatus = $complaint->status;
            $updateData = ['status' => $dto->status];

            if ($dto->agencyId) {
                $updateData['agency_id'] = $dto->agencyId;
            }

            if ($dto->status === 'selesai') {
                $updateData['completed_at'] = now();
            }

            $this->complaintRepository->update($complaint, $updateData);

            $photoPath = $this->handlePhotoProof($dto);

            ComplaintStatusLog::create([
                'complaint_id' => $complaint->id,
                'status' => $dto->status,
                'notes' => $dto->notes,
                'updated_by' => $dto->updatedByName,
                'photo_proof' => $photoPath,
            ]);

            $this->auditLog('COMPLAINT_STATUS_UPDATED',
                "Status {$complaint->ticket_code}: {$oldStatus} → {$dto->status}",
                previous: ['status' => $oldStatus],
                metadata: ['status' => $dto->status, 'agency_id' => $complaint->agency_id, 'notes' => $dto->notes],
            );

            ComplaintStatusUpdated::dispatch($complaint, $oldStatus, $dto->status);

            return $complaint->fresh(['category', 'agency', 'attachments', 'statusLogs']);
        });
    }

    protected function validateTransition(string $current, string $next): void
    {
        $allowed = [
            'menunggu' => ['diproses', 'ditolak'],
            'diproses' => ['selesai', 'ditolak'],
            'selesai' => [],
            'ditolak' => [],
        ];

        if (!in_array($next, $allowed[$current] ?? [])) {
            throw new InvalidStatusTransitionException($current, $next);
        }
    }

    protected function handlePhotoProof(UpdateComplaintStatusDTO $dto): ?string
    {
        if (!$dto->photoProof) {
            return null;
        }

        $file = $dto->photoProof;
        $extension = strtolower($file->getClientOriginalExtension());
        $filename = 'proof_' . Str::uuid()->toString() . '.' . $extension;
        $path = $file->storeAs('proofs', $filename, 'public');

        return '/storage/' . $path;
    }
}
