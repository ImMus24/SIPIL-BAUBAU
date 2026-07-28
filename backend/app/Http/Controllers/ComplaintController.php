<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\ComplaintStatusLog;
use App\Models\Attachment;
use App\Models\AuditLog;
use App\Http\Requests\StoreComplaintRequest;
use App\Http\Requests\UpdateComplaintStatusRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ComplaintController extends Controller
{
    public function index(Request $request)
    {
        $query = Complaint::with(['category', 'agency', 'attachments', 'statusLogs']);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('subdistrict') && $request->subdistrict !== 'all') {
            $query->where('subdistrict', $request->subdistrict);
        }

        if ($request->filled('urgency') && $request->urgency !== 'all') {
            $query->where('urgency', $request->urgency);
        }

        if ($request->filled('search')) {
            $q = trim(strip_tags($request->search));
            $query->where(function ($sub) use ($q) {
                $sub->where('title', 'like', "%{$q}%")
                    ->orWhere('ticket_code', 'like', "%{$q}%")
                    ->orWhere('address', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            });
        }

        $complaints = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $complaints,
        ]);
    }

    public function store(StoreComplaintRequest $request)
    {
        $validated = $request->validated();

        $ticketCode = 'SIPIL-' . date('Y') . '-' . strtoupper(Str::random(4));

        $complaint = Complaint::create([
            'ticket_code' => $ticketCode,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category_id' => $validated['category_id'],
            'user_id' => $request->user() ? $request->user()->id : null,
            'reporter_name' => $validated['reporter_name'],
            'reporter_phone' => $validated['reporter_phone'] ?? null,
            'reporter_email' => $validated['reporter_email'] ?? null,
            'address' => $validated['address'],
            'subdistrict' => $validated['subdistrict'],
            'latitude' => $validated['latitude'] ?? -5.4642000,
            'longitude' => $validated['longitude'] ?? 122.6035000,
            'urgency' => $validated['urgency'],
            'status' => 'menunggu',
        ]);

        // Secure File Upload Handling (Randomized Filenames, Validated MIME)
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $extension = strtolower($file->getClientOriginalExtension());
                $filename = Str::uuid()->toString() . '.' . $extension;
                $path = $file->storeAs('complaints', $filename, 'public');

                Attachment::create([
                    'complaint_id' => $complaint->id,
                    'file_path' => '/storage/' . $path,
                    'file_type' => $file->getClientMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }

        // Initial Log
        ComplaintStatusLog::create([
            'complaint_id' => $complaint->id,
            'status' => 'menunggu',
            'notes' => 'Laporan berhasil disubmit dan menunggu verifikasi Admin.',
            'updated_by' => 'Sistem',
        ]);

        AuditLog::log('COMPLAINT_CREATED', "Laporan pengaduan baru disubmit dengan Kode Tiket: {$ticketCode}", null, [
            'ticket_code' => $ticketCode,
            'title' => $complaint->title,
            'subdistrict' => $complaint->subdistrict,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan pengaduan berhasil terdaftar.',
            'data' => $complaint->load(['category', 'attachments', 'statusLogs']),
        ], 201);
    }

    public function showByTicket($ticketCode)
    {
        $sanitizedCode = strtoupper(trim(strip_tags($ticketCode)));

        $complaint = Complaint::with(['category', 'agency', 'attachments', 'statusLogs'])
            ->where('ticket_code', $sanitizedCode)
            ->first();

        if (!$complaint) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kode tiket pengaduan tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $complaint,
        ]);
    }

    public function updateStatus(UpdateComplaintStatusRequest $request, $id)
    {
        $complaint = Complaint::findOrFail($id);
        $oldStatus = $complaint->status;

        $validated = $request->validated();

        $complaint->status = $validated['status'];
        if (isset($validated['agency_id'])) {
            $complaint->agency_id = $validated['agency_id'];
        }
        if ($validated['status'] === 'selesai') {
            $complaint->completed_at = now();
        }
        $complaint->save();

        $photoPath = null;
        if ($request->hasFile('photo_proof')) {
            $file = $request->file('photo_proof');
            $extension = strtolower($file->getClientOriginalExtension());
            $filename = 'proof_' . Str::uuid()->toString() . '.' . $extension;
            $path = $file->storeAs('proofs', $filename, 'public');
            $photoPath = '/storage/' . $path;
        }

        ComplaintStatusLog::create([
            'complaint_id' => $complaint->id,
            'status' => $validated['status'],
            'notes' => $validated['notes'],
            'updated_by' => $request->user() ? $request->user()->name : 'Petugas OPD',
            'photo_proof' => $photoPath,
        ]);

        AuditLog::log('COMPLAINT_STATUS_UPDATED', "Status laporan {$complaint->ticket_code} diubah dari {$oldStatus} menjadi {$validated['status']}", [
            'status' => $oldStatus,
        ], [
            'status' => $validated['status'],
            'agency_id' => $complaint->agency_id,
            'notes' => $validated['notes'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Status pengaduan berhasil diperbarui.',
            'data' => $complaint->fresh(['category', 'agency', 'attachments', 'statusLogs']),
        ]);
    }

    public function myReports(Request $request)
    {
        $complaints = Complaint::with(['category', 'agency', 'attachments', 'statusLogs'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $complaints,
        ]);
    }
}
