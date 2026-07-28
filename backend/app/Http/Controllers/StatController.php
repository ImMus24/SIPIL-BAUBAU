<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use Illuminate\Http\Request;

class StatController extends Controller
{
    public function summary()
    {
        $total = Complaint::count();
        $menunggu = Complaint::where('status', 'menunggu')->count();
        $diproses = Complaint::where('status', 'diproses')->count();
        $selesai = Complaint::where('status', 'selesai')->count();
        $ditolak = Complaint::where('status', 'ditolak')->count();

        $completionRate = $total > 0 ? round(($selesai / $total) * 100, 1) : 0;

        return response()->json([
            'status' => 'success',
            'data' => [
                'total' => $total,
                'menunggu' => $menunggu,
                'diproses' => $diproses,
                'selesai' => $selesai,
                'ditolak' => $ditolak,
                'completion_rate' => $completionRate,
            ]
        ]);
    }
}
