<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AgencyResource;
use App\Models\Agency;
use Illuminate\Http\JsonResponse;

class AgencyController extends Controller
{
    public function index(): JsonResponse
    {
        $agencies = Agency::all();

        return response()->json([
            'success' => true,
            'message' => 'Daftar OPD teknis berhasil dimuat.',
            'data' => AgencyResource::collection($agencies),
        ]);
    }
}
