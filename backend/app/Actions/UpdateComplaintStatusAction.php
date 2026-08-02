<?php

namespace App\Actions;

use App\Contracts\ComplaintRepositoryInterface;
use App\DTOs\UpdateComplaintStatusDTO;
use App\Events\ComplaintStatusUpdated;
use App\Exceptions\ComplaintNotFoundException;
use App\Exceptions\InvalidStatusTransitionException;
use App\Models\Complaint;
use App\Models\ComplaintActivityLog;
use App\Models\ComplaintFile;
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

            $oldEnumStatus = $complaint->status;
            $oldStatusValue = $oldEnumStatus instanceof \App\Enums\ComplaintStatus
                ? $oldEnumStatus->value
                : $oldEnumStatus;

            $this->validateTransition($oldStatusValue, $dto->status);

            $oldStatus = $oldEnumStatus;
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

            // Activity log entry
            ComplaintActivityLog::create([
                'complaint_id' => $complaint->id,
                'action' => 'status_changed',
                'description' => "Status berubah: {$oldStatusValue} → {$dto->status}",
                'user_id' => request()->user()?->id,
                'old_value' => $oldStatusValue,
                'new_value' => $dto->status,
            ]);

            // Store uploaded proof photo as a complaint file (progress or after)
            if ($photoPath) {
                ComplaintFile::create([
                    'complaint_id' => $complaint->id,
                    'file_path' => $photoPath,
                    'file_type' => $dto->photoProof?->getMimeType() ?? 'image/jpeg',
                    'category' => $dto->status === 'selesai' ? 'after' : 'progress',
                    'file_size' => $dto->photoProof?->getSize(),
                    'uploaded_by' => request()->user()?->id,
                ]);
            }

            $this->auditLog('COMPLAINT_STATUS_UPDATED',
                "Status {$complaint->ticket_code}: {$oldStatusValue} → {$dto->status}",
                previous: ['status' => $oldStatusValue],
                metadata: ['status' => $dto->status, 'agency_id' => $complaint->agency_id, 'notes' => $dto->notes],
            );

            ComplaintStatusUpdated::dispatch($complaint, $oldStatusValue, $dto->status);

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
