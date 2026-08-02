<?php

namespace App\Services;

use App\Actions\CreateComplaintAction;
use App\Actions\UpdateComplaintStatusAction;
use App\Contracts\ComplaintRepositoryInterface;
use App\DTOs\StoreComplaintDTO;
use App\DTOs\UpdateComplaintStatusDTO;
use App\Models\Complaint;
use App\Models\ComplaintActivityLog;
use App\Models\ComplaintComment;
use App\Models\ComplaintFile;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

    public function getComplaintDetail(int $id): ?Complaint
    {
        $complaint = $this->complaintRepository->findWithDetail($id);

        if (!$complaint) {
            return null;
        }

        // Attach related complaints (nearby / same category) as a transient property
        $complaint->setRelation(
            'related',
            $this->complaintRepository->getRelated($id, $complaint->category_id, $complaint->subdistrict)
        );

        return $complaint;
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

    public function addComment(int $complaintId, string $body, ?int $userId): ?ComplaintComment
    {
        $complaint = $this->complaintRepository->findById($complaintId);
        if (!$complaint) {
            return null;
        }

        $comment = ComplaintComment::create([
            'complaint_id' => $complaintId,
            'user_id' => $userId,
            'body' => trim($body),
        ]);

        ComplaintActivityLog::create([
            'complaint_id' => $complaintId,
            'action' => 'comment_added',
            'description' => 'Komentar ditambahkan',
            'user_id' => $userId,
            'new_value' => Str::limit($body, 200),
        ]);

        return $comment->load('user');
    }

    public function uploadFile(int $complaintId, UploadedFile $file, string $category, ?int $userId): ?ComplaintFile
    {
        $complaint = $this->complaintRepository->findById($complaintId);
        if (!$complaint) {
            return null;
        }

        // Derive extension from the validated mime type — never trust the
        // client-supplied original extension (defense against spoofing).
        $mimeToExt = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'application/pdf' => 'pdf',
            'video/mp4' => 'mp4',
            'video/quicktime' => 'mov',
        ];
        $extension = $mimeToExt[$file->getMimeType()] ?? 'bin';
        $filename = 'complaint_' . $complaintId . '_' . Str::uuid()->toString() . '.' . $extension;
        $path = $file->storeAs('complaint-files', $filename, 'public');

        $complaintFile = ComplaintFile::create([
            'complaint_id' => $complaintId,
            'file_path' => '/storage/' . $path,
            'file_type' => $file->getMimeType() ?? 'application/octet-stream',
            'category' => in_array($category, ['before', 'progress', 'after', 'support'], true) ? $category : 'support',
            'file_size' => $file->getSize(),
            'uploaded_by' => $userId,
        ]);

        ComplaintActivityLog::create([
            'complaint_id' => $complaintId,
            'action' => 'file_uploaded',
            'description' => 'Berkas ' . $category . ' diunggah',
            'user_id' => $userId,
            'new_value' => $category,
        ]);

        return $complaintFile->load('uploader');
    }
}
