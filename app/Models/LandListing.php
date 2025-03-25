<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandListing extends Model
{
    protected $fillable = [
        'user_id', 'full_name', 'birth_place_date', 'address', 
        'ktp_id', 'religion', 'phone_number', 
        'npwp', 'ktp_scan', 'package_id', 'land_photos', 'admin_status'
    ];

    protected $casts = [
        'land_photos' => 'array',
        'package_id' => 'integer'
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
}