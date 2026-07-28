<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    protected $fillable = [
        'ticket_code',
        'title',
        'description',
        'category_id',
        'agency_id',
        'user_id',
        'reporter_name',
        'reporter_phone',
        'reporter_email',
        'address',
        'subdistrict',
        'latitude',
        'longitude',
        'urgency',
        'status',
        'rejection_reason',
        'estimated_completion_date',
        'completed_at',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'completed_at' => 'datetime',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function agency()
    {
        return $this->belongsTo(Agency::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

    public function statusLogs()
    {
        return $this->hasMany(ComplaintStatusLog::class)->orderBy('created_at', 'asc');
    }
}
