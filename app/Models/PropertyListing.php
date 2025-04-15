<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PropertyListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'price',
        'place',
        'desc_detail',
        'maps',
        'wa',
        'image',
        'images',
        'status',
        'featured',
        'land_area',
        'certificate_type',
        'latitude',
        'longitude',
        'land_listing_id',
        'user_id'
    ];

    protected $casts = [
        'featured' => 'boolean',
        'images' => 'array',
        'price' => 'float',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    // Relationship with LandListing
    public function landListing()
    {
        return $this->belongsTo(LandListing::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scope for active sale listings
    public function scopeForSale($query)
    {
        return $query->where('status', 'active')
                     ->where('featured', false)
                     ->orderBy('created_at', 'desc');
    }

    // Scope for featured listings
    public function scopeFeaturedListings($query)
    {
        return $query->where('status', 'active')
                     ->where('featured', true)
                     ->orderBy('created_at', 'desc');
    }
}

