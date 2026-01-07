<?php

namespace Database\Seeders;

use App\Models\PropertyListing;
use App\Models\LandListing;
use App\Models\User;
use Illuminate\Database\Seeder;

class PropertyListingSeeder extends Seeder
{
    public function run()
    {
        // Hapus properti yang ada jika diperlukan
        // PropertyListing::truncate();
        
        // Pastikan ada user dan land listing
        $user = User::first() ?? User::factory()->create();
        $landListing = LandListing::first() ?? LandListing::factory()->create([
            'user_id' => $user->id,
            'admin_status' => 'approved'
        ]);
        
        // Buat beberapa properti dengan featured=true
        for ($i = 1; $i <= 3; $i++) {
            PropertyListing::create([
                'land_listing_id' => $landListing->id,
                'user_id' => $user->id,
                'image' => 'property/tanah' . ($i % 4 + 1) . '.jpg',
                'images' => json_encode([
                    'property/property_14_DISEWAKANTANAHLUASUNTUKRUKO_1.jpg',
                    'property/property_15_TANAHKAVLINGPERUMAHANVIEWGUNUNG_1.jpg',
                    'property/property_13_TANAHSTRATEGISDEKATKAMPUSUB_1.jpg',
                    'property/property_15_TANAHKAVLINGPERUMAHANVIEWGUNUNG_1.jpg'
                ]),
                'title' => 'Properti Pilihan Masa Depan',
                'status' => $i % 2 == 0 ? 'Dijual' : 'Disewa',
                'price' => rand(100000000, 1000000000),
                'description' => 'Deskripsi properti pilihan ' . $i,
                'place' => 'Malang, Jawa Timur',
                'desc_detail' => 'Detail lengkap properti pilihan ' . $i,
                'maps' => 'https://maps.google.com',
                'wa' => '6287889601959',
                'featured' => true, 
                'latitude' => -7.9666 + (rand(-100, 100) / 1000),
                'longitude' => 112.6326 + (rand(-100, 100) / 1000),
                'land_area' => rand(100, 1000),
                'certificate_type' => ['SHM', 'HGB', 'AJB'][rand(0, 2)]
            ]);
        }
    }
}