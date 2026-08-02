<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComplaintCommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'complaint_id' => $this->complaint_id,
            'user_id' => $this->user_id,
            'body' => $this->body,
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'role' => $this->user?->role?->value ?? $this->user?->role,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
