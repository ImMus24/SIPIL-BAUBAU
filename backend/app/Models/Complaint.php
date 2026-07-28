<?php

namespace App\Models;

use App\Enums\ComplaintStatus;
use App\Enums\UrgencyLevel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'latitude'    => 'float',
        'longitude'   => 'float',
        'completed_at' => 'datetime',
        'status'      => ComplaintStatus::class,
        'urgency'     => UrgencyLevel::class,
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class);
    }

    public function statusLogs(): HasMany
    {
        return $this->hasMany(ComplaintStatusLog::class)->orderBy('created_at', 'asc');
    }
}
