<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'full_name', 'birth_place_date', 'address',
        'ktp_id', 'phone_number',
        'npwp', 'ktp_scan', 'package_id', 'land_photos', 'admin_status',
        'is_paid', 'expiry_date', 'status'
    ];

    protected $casts = [
        'land_photos' => 'array',
        'package_id' => 'integer',
        'is_paid' => 'boolean',
        'expiry_date' => 'datetime'
    ];

    public function setLandPhotosAttribute($value)
    {
        $this->attributes['land_photos'] = is_array($value)
            ? json_encode($value)
            : ($value ?? json_encode([]));
    }

    public function getLandPhotosAttribute($value)
    {
        return json_decode($value, true) ?? [];
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
    {
        return $this->hasMany(LandListingImage::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function latestPayment()
    {
        return $this->hasOne(Payment::class)->latest();
    }
}
