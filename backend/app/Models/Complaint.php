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

    public function comments(): HasMany
    {
        return $this->hasMany(ComplaintComment::class)->orderBy('created_at', 'asc');
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ComplaintActivityLog::class)->orderBy('created_at', 'asc');
    }

    public function files(): HasMany
    {
        return $this->hasMany(ComplaintFile::class)->orderBy('created_at', 'asc');
    }

    /**
     * Notifications referencing this complaint via the data->complaint_id JSON field.
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'data->complaint_id', 'id');
    }
}
