<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\ComplaintStatusLog;
use App\Models\Attachment;
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
            $q = $request->search;
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'subdistrict' => 'required|string',
            'address' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'urgency' => 'required|in:rendah,sedang,tinggi,darurat',
            'reporter_name' => 'required|string',
            'reporter_phone' => 'nullable|string',
            'reporter_email' => 'nullable|email',
        ]);

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

        // Attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('complaints', 'public');
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

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan pengaduan berhasil terdaftar.',
            'data' => $complaint->load(['category', 'attachments', 'statusLogs']),
        ], 201);
    }

    public function showByTicket($ticketCode)
    {
        $complaint = Complaint::with(['category', 'agency', 'attachments', 'statusLogs'])
            ->where('ticket_code', strtoupper($ticketCode))
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $complaint,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $complaint = Complaint::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:menunggu,diproses,selesai,ditolak',
            'notes' => 'required|string',
            'agency_id' => 'nullable|exists:agencies,id',
            'photo_proof' => 'nullable|image|max:5120',
        ]);

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
            $photoPath = '/storage/' . $request->file('photo_proof')->store('proofs', 'public');
        }

        ComplaintStatusLog::create([
            'complaint_id' => $complaint->id,
            'status' => $validated['status'],
            'notes' => $validated['notes'],
            'updated_by' => $request->user() ? $request->user()->name : 'Petugas OPD',
            'photo_proof' => $photoPath,
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
