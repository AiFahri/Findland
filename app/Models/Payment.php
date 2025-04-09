<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'user_id',
        'package_id',
        'land_listing_id',
        'amount',
        'status',
        'payment_type',
        'snap_token',
        'paid_at',
        'expired_at'
    ];

    protected $casts = [
        'amount' => 'float',
        'paid_at' => 'datetime',
        'expired_at' => 'datetime',
        'is_paid' => 'boolean',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function landListing()
    {
        return $this->belongsTo(LandListing::class);
    }

    public function scopeUnpaid($query)
    {
        return $query->where('status', 'unpaid');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'expired');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeDenied($query)
    {
        return $query->where('status', 'denied');
    }
}
