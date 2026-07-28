<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::all();

        return response()->json([
            'success' => true,
            'message' => 'Daftar kategori infrastruktur berhasil dimuat.',
            'data' => CategoryResource::collection($categories),
        ]);
    }
}
