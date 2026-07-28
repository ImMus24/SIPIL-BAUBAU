<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComplaintStatusLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'notes' => $this->notes,
            'updated_by' => $this->updated_by,
            'photo_proof' => $this->photo_proof,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
