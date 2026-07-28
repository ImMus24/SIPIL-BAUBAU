<?php

namespace App\Services;

use App\Contracts\ComplaintRepositoryInterface;
use App\DTOs\StoreComplaintDTO;
use App\DTOs\UpdateComplaintStatusDTO;
use App\Models\Complaint;
use App\Models\ComplaintStatusLog;
use App\Models\Attachment;
use App\Models\AuditLog;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ComplaintService
{
    public function __construct(
        protected ComplaintRepositoryInterface $complaintRepository
    ) {}

    public function getComplaints(array $filters)
    {
        return $this->complaintRepository->getAllFiltered($filters);
    }

    public function getComplaintByTicket(string $ticketCode): ?Complaint
    {
        return $this->complaintRepository->findByTicketCode($ticketCode);
    }

    public function getComplaintsByUser(int $userId)
    {
        return $this->complaintRepository->getByUserId($userId);
    }

    public function createComplaint(StoreComplaintDTO $dto): Complaint
    {
        return DB::transaction(function () use ($dto) {
            $ticketCode = 'SIPIL-' . date('Y') . '-' . strtoupper(Str::random(4));

            $complaint = $this->complaintRepository->create([
                'ticket_code' => $ticketCode,
                'title' => $dto->title,
                'description' => $dto->description,
                'category_id' => $dto->categoryId,
                'user_id' => $dto->userId,
                'reporter_name' => $dto->reporterName,
                'reporter_phone' => $dto->reporterPhone,
                'reporter_email' => $dto->reporterEmail,
                'address' => $dto->address,
                'subdistrict' => $dto->subdistrict,
                'latitude' => $dto->latitude ?? -5.4642000,
                'longitude' => $dto->longitude ?? 122.6035000,
                'urgency' => $dto->urgency,
                'status' => 'menunggu',
            ]);

            // File Uploads
            if (!empty($dto->attachments)) {
                foreach ($dto->attachments as $file) {
                    $extension = strtolower($file->getClientOriginalExtension());
                    $filename = Str::uuid()->toString() . '.' . $extension;
                    $path = $file->storeAs('complaints', $filename, 'public');

                    Attachment::create([
                        'complaint_id' => $complaint->id,
                        'file_path' => '/storage/' . $path,
                        'file_type' => $file->getClientMimeType(),
                        'file_size' => $file->getSize(),
                    ]);
                }
            }

            // Initial Log
            ComplaintStatusLog::create([
                'complaint_id' => $complaint->id,
                'status' => 'menunggu',
                'notes' => 'Laporan berhasil disubmit dan menunggu verifikasi Admin.',
                'updated_by' => 'Sistem',
            ]);

            AuditLog::log('COMPLAINT_CREATED', "Laporan pengaduan baru disubmit dengan Kode Tiket: {$ticketCode}", null, [
                'ticket_code' => $ticketCode,
                'title' => $complaint->title,
                'subdistrict' => $complaint->subdistrict,
            ]);

            return $complaint->load(['category', 'attachments', 'statusLogs']);
        });
    }

    public function updateStatus(UpdateComplaintStatusDTO $dto): Complaint
    {
        return DB::transaction(function () use ($dto) {
            $complaint = $this->complaintRepository->findById($dto->complaintId);
            if (!$complaint) {
                throw new \InvalidArgumentException('Laporan pengaduan tidak ditemukan.');
            }

            $oldStatus = $complaint->status;

            $updateData = ['status' => $dto->status];
            if ($dto->agencyId) {
                $updateData['agency_id'] = $dto->agencyId;
            }
            if ($dto->status === 'selesai') {
                $updateData['completed_at'] = now();
            }

            $this->complaintRepository->update($complaint, $updateData);

            $photoPath = null;
            if ($dto->photoProof) {
                $file = $dto->photoProof;
                $extension = strtolower($file->getClientOriginalExtension());
                $filename = 'proof_' . Str::uuid()->toString() . '.' . $extension;
                $path = $file->storeAs('proofs', $filename, 'public');
                $photoPath = '/storage/' . $path;
            }

            ComplaintStatusLog::create([
                'complaint_id' => $complaint->id,
                'status' => $dto->status,
                'notes' => $dto->notes,
                'updated_by' => $dto->updatedByName,
                'photo_proof' => $photoPath,
            ]);

            AuditLog::log('COMPLAINT_STATUS_UPDATED', "Status laporan {$complaint->ticket_code} diubah dari {$oldStatus} menjadi {$dto->status}", [
                'status' => $oldStatus,
            ], [
                'status' => $dto->status,
                'agency_id' => $complaint->agency_id,
                'notes' => $dto->notes,
            ]);

            return $complaint->fresh(['category', 'agency', 'attachments', 'statusLogs']);
        });
    }
}
