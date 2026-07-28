<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComplaintStatusLog extends Model
{
    protected $fillable = [
        'complaint_id',
        'status',
        'notes',
        'updated_by',
        'photo_proof',
    ];

    public function complaint()
    {
        return $this->belongsTo(Complaint::class);
    }
}
