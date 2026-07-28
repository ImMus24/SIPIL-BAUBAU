<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'phone' => $this->phone,
            'avatar' => $this->avatar,
            'agency_id' => $this->agency_id,
            'agency' => new AgencyResource($this->whenLoaded('agency')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
