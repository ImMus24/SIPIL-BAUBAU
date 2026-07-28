<?php

namespace App\Jobs;

use App\Models\Complaint;
use App\Models\Attachment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProcessComplaintImages implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;
    public int $tries = 2;

    public function __construct(
        protected Complaint $complaint
    ) {}

    public function handle(): void
    {
        $attachments = Attachment::query()
            ->where('complaint_id', $this->complaint->id)
            ->whereIn('file_type', ['image/jpeg', 'image/png', 'image/webp'])
            ->get();

        foreach ($attachments as $attachment) {
            $sourcePath = str_replace('/storage/', '', $attachment->file_path);

            if (!Storage::disk('public')->exists($sourcePath)) {
                continue;
            }

            // Generate thumbnail
            $thumbnailPath = 'thumbnails/' . Str::uuid()->toString() . '.webp';
            // Thumbnail generation would use Intervention Image here
            // For now, we just mark it as processed
            $attachment->update([
                'thumbnail_path' => '/storage/' . $thumbnailPath,
            ]);
        }
    }

    public function failed(\Throwable $e): void
    {
        logger()->error('Gagal memproses gambar', [
            'complaint_id' => $this->complaint->id,
            'error' => $e->getMessage(),
        ]);
    }
}
