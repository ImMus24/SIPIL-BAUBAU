<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreComplaintRequest;
use App\Http\Requests\UpdateComplaintStatusRequest;
use App\Http\Resources\ComplaintResource;
use App\DTOs\StoreComplaintDTO;
use App\DTOs\UpdateComplaintStatusDTO;
use App\Services\ComplaintService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function __construct(
        protected ComplaintService $complaintService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $complaints = $this->complaintService->getComplaints($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Daftar pengaduan berhasil dimuat.',
            'data' => ComplaintResource::collection($complaints),
        ]);
    }

    public function store(StoreComplaintRequest $request): JsonResponse
    {
        $dto = StoreComplaintDTO::fromRequest(
            $request->validated(),
            $request->user()?->id,
            $request->hasFile('attachments') ? $request->file('attachments') : []
        );

        $complaint = $this->complaintService->createComplaint($dto);

        return response()->json([
            'success' => true,
            'message' => 'Laporan pengaduan berhasil terdaftar.',
            'data' => new ComplaintResource($complaint),
        ], 201);
    }

    public function showByTicket(string $ticket_code): JsonResponse
    {
        $complaint = $this->complaintService->getComplaintByTicket($ticket_code);

        if (!$complaint) {
            return response()->json([
                'success' => false,
                'message' => 'Kode tiket pengaduan tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail pengaduan ditemukan.',
            'data' => new ComplaintResource($complaint),
        ]);
    }

    public function updateStatus(UpdateComplaintStatusRequest $request, int $id): JsonResponse
    {
        // Fetch the complaint first to pass to the policy gate
        $complaint = $this->complaintService->getComplaintById($id);

        if (!$complaint) {
            return response()->json([
                'success' => false,
                'message' => 'Pengaduan tidak ditemukan.',
            ], 404);
        }

        // Authorize via ComplaintPolicy::updateStatus (agency-scoped)
        $this->authorize('updateStatus', $complaint);

        $dto = UpdateComplaintStatusDTO::fromRequest(
            $id,
            $request->validated(),
            $request->file('photo_proof'),
            $request->user()?->name
        );

        $complaint = $this->complaintService->updateStatus($dto);

        return response()->json([
            'success' => true,
            'message' => 'Status pengaduan berhasil diperbarui.',
            'data' => new ComplaintResource($complaint),
        ]);
    }

    public function myReports(Request $request): JsonResponse
    {
        $complaints = $this->complaintService->getComplaintsByUser($request->user()->id);

        return response()->json([
            'success' => true,
            'message' => 'Daftar laporan pengguna berhasil dimuat.',
            'data' => ComplaintResource::collection($complaints),
        ]);
    }
}
