<?php

namespace App\DTOs;

readonly class UpdateComplaintStatusDTO
{
    public function __construct(
        public int $complaintId,
        public string $status,
        public string $notes,
        public ?int $agencyId = null,
        public ?object $photoProof = null,
        public ?string $updatedByName = null,
    ) {}

    public static function fromRequest(int $complaintId, array $validated, ?object $photoProof = null, ?string $updatedByName = null): self
    {
        return new self(
            complaintId: $complaintId,
            status: $validated['status'],
            notes: $validated['notes'],
            agencyId: isset($validated['agency_id']) ? (int) $validated['agency_id'] : null,
            photoProof: $photoProof,
            updatedByName: $updatedByName ?? 'Petugas OPD',
        );
    }
}
