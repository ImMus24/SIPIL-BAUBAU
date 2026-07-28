<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AgencyResource;
use App\Http\Resources\CategoryResource;
use App\Models\Agency;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class DataController extends Controller
{
    public function categories(): JsonResponse
    {
        $categories = Cache::remember('categories', 3600, fn() => Category::all());

        return response()->json([
            'success' => true,
            'message' => 'Daftar kategori infrastruktur berhasil dimuat.',
            'data' => CategoryResource::collection($categories),
        ]);
    }

    public function agencies(): JsonResponse
    {
        $agencies = Cache::remember('agencies', 3600, fn() => Agency::all());

        return response()->json([
            'success' => true,
            'message' => 'Daftar OPD teknis berhasil dimuat.',
            'data' => AgencyResource::collection($agencies),
        ]);
    }
}
