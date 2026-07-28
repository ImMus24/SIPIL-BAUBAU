<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agency extends Model
{
    protected $fillable = [
        'code',
        'name',
        'description',
        'contact_email',
        'phone',
    ];

    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
