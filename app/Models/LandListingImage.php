<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandListingImage extends Model
{
    protected $fillable = [
        'land_listing_id', 'path'
    ];

    public function landListing()
    {
        return $this->belongsTo(LandListing::class);
    }
}