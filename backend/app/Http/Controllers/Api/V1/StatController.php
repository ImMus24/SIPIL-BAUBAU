<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\StatService;
use Illuminate\Http\JsonResponse;

class StatController extends Controller
{
    public function __construct(
        protected StatService $statService
    ) {}

    public function summary(): JsonResponse
    {
        $stats = $this->statService->getSummary();

        return response()->json([
            'success' => true,
            'message' => 'Ringkasan statistik berhasil dimuat.',
            'data' => $stats,
        ]);
    }
}
