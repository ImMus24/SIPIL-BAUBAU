<?php

namespace App\Observers;

use App\Models\Complaint;
use App\Jobs\ProcessComplaintImages;

class ComplaintObserver
{
    public function created(Complaint $complaint): void
    {
        ProcessComplaintImages::dispatch($complaint)->onQueue('images');
    }

    public function deleted(Complaint $complaint): void
    {
        // Clean up attachments when a complaint is deleted
        foreach ($complaint->attachments as $attachment) {
            $path = str_replace('/storage/', '', $attachment->file_path);
            \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
            $attachment->delete();
        }
    }
}
