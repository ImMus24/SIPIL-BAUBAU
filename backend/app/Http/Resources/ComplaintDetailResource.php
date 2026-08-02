<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComplaintDetailResource extends JsonResource
{
    /**
     * Rich complaint detail payload for the central detail page.
     * Includes reporter info, officer, timeline, photos, notifications,
     * comments, activity log, related complaints, and SLA/progress metrics.
     */
    public function toArray(Request $request): array
    {
        $progress = $this->computeProgress();
        $sla = $this->computeSla();

        // Current officer: newest status log actor that is not "Sistem"
        $currentOfficer = null;
        $latestLog = $this->statusLogs->last();
        if ($latestLog && $latestLog->updated_by && $latestLog->updated_by !== 'Sistem') {
            $currentOfficer = $latestLog->updated_by;
        }

        $related = $this->related ?? collect();

        return [
            // Core complaint fields (mirrors ComplaintResource)
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
            'rejection_reason' => $this->when($this->status === 'ditolak', $this->rejection_reason),
            'estimated_completion_date' => $this->estimated_completion_date?->toIso8601String(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),

            // Derived / enriched
            'current_officer' => $currentOfficer,
            'progress_percentage' => $progress['percentage'],
            'progress_label' => $progress['label'],
            'sla' => $sla,

            // Related collections
            'attachments' => AttachmentResource::collection($this->whenLoaded('attachments')),
            'status_logs' => ComplaintStatusLogResource::collection($this->whenLoaded('statusLogs')),
            'comments' => ComplaintCommentResource::collection($this->whenLoaded('comments')),
            'activity_logs' => ComplaintActivityResource::collection($this->whenLoaded('activityLogs')),
            'files' => ComplaintFileResource::collection($this->whenLoaded('files')),
            'notifications' => $this->whenLoaded('notifications', fn () => $this->notifications->map(fn ($n) => [
                'id' => $n->id,
                'type' => $n->type,
                'title' => $n->title,
                'message' => $n->message,
                'is_read' => (bool) $n->is_read,
                'created_at' => $n->created_at?->toIso8601String(),
            ])),
            'related' => ComplaintResource::collection($related),
        ];
    }

    protected function computeProgress(): array
    {
        $status = $this->status instanceof \App\Enums\ComplaintStatus
            ? $this->status->value
            : $this->status;
        $map = [
            'menunggu' => ['percentage' => 10, 'label' => 'Menunggu Verifikasi'],
            'diproses' => ['percentage' => 55, 'label' => 'Sedang Diproses'],
            'selesai'  => ['percentage' => 100, 'label' => 'Selesai Ditangani'],
            'ditolak'  => ['percentage' => 100, 'label' => 'Laporan Ditolak'],
        ];

        // Refine "diproses" progress based on files uploaded (progress photos)
        if ($status === 'diproses' && $this->relationLoaded('files')) {
            $hasProgress = $this->files->contains(fn ($f) => $f->category === 'progress');
            $hasAfter = $this->files->contains(fn ($f) => $f->category === 'after');
            $pct = $hasAfter ? 90 : ($hasProgress ? 70 : 55);
            return ['percentage' => $pct, 'label' => 'Sedang Diproses'];
        }

        return $map[$status] ?? ['percentage' => 0, 'label' => 'Tidak Diketahui'];
    }

    protected function computeSla(): array
    {
        $created = $this->created_at;
        $estimated = $this->estimated_completion_date;

        if ($this->completed_at) {
            $days = max(0, (int) $created?->diffInDays($this->completed_at));
            return [
                'days' => $days,
                'status' => 'selesai',
                'label' => "Selesai dalam {$days} hari",
                'deadline' => $this->completed_at?->toIso8601String(),
            ];
        }

        if (!$estimated) {
            return [
                'days' => 0,
                'status' => 'unknown',
                'label' => 'Belum ditentukan',
                'deadline' => null,
            ];
        }

        $daysLeft = max(0, (int) now()->startOfDay()->diffInDays($estimated, false));
        $overdue = now()->startOfDay()->gt($estimated);

        return [
            'days' => $daysLeft,
            'status' => $overdue ? 'overdue' : 'on_track',
            'label' => $overdue
                ? 'Terlambat ' . abs($daysLeft) . ' hari'
                : "Sisa {$daysLeft} hari",
            'deadline' => $estimated->toIso8601String(),
        ];
    }
}
