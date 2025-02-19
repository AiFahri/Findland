<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'image', 'images', 'status', 'price', 
        'place', 'description', 'desc_detail', 
        'maps', 'wa', 'featured'
    ];

    protected $casts = [
        'images' => 'array',
        'featured' => 'boolean'
    ];

    // Scope methods for filtering
    public function scopeForSale($query)
    {
        return $query->where('status', 'Dijual');
    }

    public function scopeForRent($query)
    {
        return $query->where('status', 'Disewa');
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }
}