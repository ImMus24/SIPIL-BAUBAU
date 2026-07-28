<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComplaintResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ticket_code' => $this->ticket_code,
            'title' => $this->title,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'agency_id' => $this->agency_id,
            'agency' => new AgencyResource($this->whenLoaded('agency')),
            'user_id' => $this->user_id,
            'reporter_name' => $this->reporter_name,
            'reporter_phone' => $this->reporter_phone,
            'reporter_email' => $this->reporter_email,
            'address' => $this->address,
            'subdistrict' => $this->subdistrict,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'urgency' => $this->urgency,
            'status' => $this->status,
            'completed_at' => $this->completed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'attachments' => AttachmentResource::collection($this->whenLoaded('attachments')),
            'status_logs' => ComplaintStatusLogResource::collection($this->whenLoaded('statusLogs')),
        ];
    }
}
