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

            // TODO: implement actual thumbnail generation using Intervention Image.
            // Do NOT write thumbnail_path until a real thumbnail file is produced.
            logger()->info('Image processing placeholder — thumbnail generation not yet implemented.', [
                'attachment_id' => $attachment->id,
                'source'        => $sourcePath,
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
