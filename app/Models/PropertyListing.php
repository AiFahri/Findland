<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PropertyListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'land_listing_id', 
        'user_id', 
        'title', 
        'description', 
        'price', 
        'location', 
        'land_area', 
        'certificate_type', 
        'status', 
        'featured',
        'latitude', 
        'longitude'
    ];

    protected $casts = [
        'featured' => 'boolean',
        'price' => 'float',
        'land_area' => 'float'
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