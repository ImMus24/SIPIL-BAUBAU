<?php

namespace App\Actions;

use App\Contracts\ComplaintRepositoryInterface;
use App\DTOs\StoreComplaintDTO;
use App\Events\ComplaintCreated;
use App\Exceptions\DuplicateReportException;
use App\Exceptions\FileUploadException;
use App\Models\Attachment;
use App\Models\Complaint;
use App\Models\ComplaintStatusLog;
use App\ValueObjects\TicketCode;
use App\Traits\Auditable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateComplaintAction
{
    use Auditable;

    public function __construct(
        protected ComplaintRepositoryInterface $complaintRepository
    ) {}

    public function execute(StoreComplaintDTO $dto): Complaint
    {
        return DB::transaction(function () use ($dto) {
            $this->checkDuplicate($dto);

            $ticketCode = TicketCode::generate();
            $coordinates = $dto->toCoordinates();

            if (!$coordinates->hasValid()) {
                $coordinates = \App\ValueObjects\Coordinate::baubauDefault();
            }

            $complaint = $this->complaintRepository->create([
                'ticket_code' => $ticketCode->value(),
                'title' => $dto->title,
                'description' => $dto->description,
                'category_id' => $dto->categoryId,
                'user_id' => $dto->userId,
                'reporter_name' => $dto->reporterName,
                'reporter_phone' => $dto->reporterPhone,
                'reporter_email' => $dto->reporterEmail,
                'address' => $dto->address,
                'subdistrict' => $dto->subdistrict,
                'latitude' => $coordinates->latitude(),
                'longitude' => $coordinates->longitude(),
                'urgency' => $dto->urgency,
                'status' => 'menunggu',
            ]);

            $this->handleAttachments($complaint, $dto);

            ComplaintStatusLog::create([
                'complaint_id' => $complaint->id,
                'status' => 'menunggu',
                'notes' => 'Laporan berhasil disubmit dan menunggu verifikasi Admin.',
                'updated_by' => 'Sistem',
            ]);

            $this->auditLog('COMPLAINT_CREATED', "Laporan pengaduan baru: {$ticketCode}", metadata: [
                'ticket_code' => $ticketCode->value(),
                'title' => $complaint->title,
                'urgency' => $complaint->urgency,
                'subdistrict' => $complaint->subdistrict,
            ]);

            ComplaintCreated::dispatch($complaint);

            return $complaint->load(['category', 'attachments', 'statusLogs']);
        });
    }

    protected function checkDuplicate(StoreComplaintDTO $dto): void
    {
        $existing = $this->complaintRepository->findDuplicate(
            $dto->reporterEmail ?? $dto->reporterPhone,
            $dto->address,
            $dto->categoryId,
        );

        if ($existing) {
            throw new DuplicateReportException("alamat dan kategori yang sama dalam 24 jam terakhir");
        }
    }

    protected function handleAttachments(Complaint $complaint, StoreComplaintDTO $dto): void
    {
        if (empty($dto->attachments)) {
            return;
        }

        foreach ($dto->attachments as $file) {
            try {
                $extension = strtolower($file->getClientOriginalExtension());
                $filename = Str::uuid()->toString() . '.' . $extension;
                $path = $file->storeAs('complaints', $filename, 'public');

                Attachment::create([
                    'complaint_id' => $complaint->id,
                    'file_path' => '/storage/' . $path,
                    'file_type' => $file->getClientMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            } catch (\Throwable $e) {
                throw new FileUploadException($e->getMessage());
            }
        }
    }
}
