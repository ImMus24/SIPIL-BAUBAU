<?php

namespace App\DTOs;

readonly class StoreComplaintDTO
{
    public function __construct(
        public string $title,
        public string $description,
        public int $categoryId,
        public string $subdistrict,
        public string $address,
        public string $urgency,
        public string $reporterName,
        public ?string $reporterPhone = null,
        public ?string $reporterEmail = null,
        public ?float $latitude = null,
        public ?float $longitude = null,
        public ?int $userId = null,
        public array $attachments = [],
    ) {}

    public static function fromRequest(array $validated, ?int $userId = null, array $attachments = []): self
    {
        return new self(
            title: $validated['title'],
            description: $validated['description'],
            categoryId: (int) $validated['category_id'],
            subdistrict: $validated['subdistrict'],
            address: $validated['address'],
            urgency: $validated['urgency'],
            reporterName: $validated['reporter_name'],
            reporterPhone: $validated['reporter_phone'] ?? null,
            reporterEmail: $validated['reporter_email'] ?? null,
            latitude: isset($validated['latitude']) ? (float) $validated['latitude'] : null,
            longitude: isset($validated['longitude']) ? (float) $validated['longitude'] : null,
            userId: $userId,
            attachments: $attachments,
        );
    }

    public function toCoordinates(): \App\ValueObjects\Coordinate
    {
        return \App\ValueObjects\Coordinate::from($this->latitude, $this->longitude);
    }
}
