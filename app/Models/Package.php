<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'price', 'duration'];

    protected $casts = [
        'price' => 'float',
        'duration' => 'integer'
    ];

    public function landListings()
    {
        return $this->hasMany(LandListing::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
