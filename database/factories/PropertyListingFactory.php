<?php
namespace Database\Factories;

use App\Models\LandListing;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyListingFactory extends Factory
{
    public function definition()
    {
        $statuses = ['Dijual', 'Disewa'];
        $images = [
            [
                '/storage/property/property_14_DISEWAKANTANAHLUASUNTUKRUKO_1.jpg',
                '/storage/property/property_15_TANAHKAVLINGPERUMAHANVIEWGUNUNG_1.jpg',
                '/storage/property/property_13_TANAHSTRATEGISDEKATKAMPUSUB_1.jpg',
                '/storage/property/property_15_TANAHKAVLINGPERUMAHANVIEWGUNUNG_1.jpg'
            ],
            [
                '/storage/property/property_14_DISEWAKANTANAHLUASUNTUKRUKO_1.jpg',
                '/storage/property/property_15_TANAHKAVLINGPERUMAHANVIEWGUNUNG_1.jpg',
                '/storage/property/property_13_TANAHSTRATEGISDEKATKAMPUSUB_1.jpg',
                '/storage/property/property_15_TANAHKAVLINGPERUMAHANVIEWGUNUNG_1.jpg'
            ]
        ];

        // Ambil random LandListing jika ada
        $landListing = LandListing::inRandomOrder()->first();

        return [
            'land_listing_id' => $landListing ? $landListing->id : null,
            'user_id' => $landListing ? $landListing->user_id : null,
            'image' => $this->faker->randomElement($images[0]),
            'images' => json_encode($this->faker->randomElement($images)),
            'title' => $this->faker->words(3, true),
            'status' => $this->faker->randomElement($statuses),
            'price' => $this->faker->numberBetween(100000000, 1000000000),
            'description' => $this->faker->sentence(10),
            'place' => $this->faker->city . ', ' . $this->faker->state,
            'desc_detail' => $this->faker->paragraph,
            'maps' => $this->faker->url,
            'wa' => $this->faker->phoneNumber,
            'featured' => $this->faker->boolean(20),
            'latitude' => $this->faker->latitude,
            'longitude' => $this->faker->longitude,
            'land_area' => $this->faker->numberBetween(100, 1000),
            'certificate_type' => $this->faker->randomElement(['SHM', 'HGB', 'AJB']),
        ];
    }
}

