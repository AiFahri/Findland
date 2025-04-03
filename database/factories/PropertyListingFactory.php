<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyListingFactory extends Factory
{
    public function definition()
    {
        $statuses = ['Dijual', 'Disewa'];
        $images   = [
            '/assets/tanah1.jpg',
            '/assets/tanah2.jpg',
        ];

        return [
            'image'       => $this->faker->randomElement($images),
            'images'      => json_encode([
                $this->faker->randomElement($images),
                $this->faker->randomElement($images),
            ]),
            'title'       => $this->faker->words(3, true),
            'status'      => $this->faker->randomElement($statuses),
            'price'       => $this->faker->numberBetween(100000000, 1000000000),
            'description' => $this->faker->sentence(10),
            'place'       => $this->faker->city . ', ' . $this->faker->state,
            'desc_detail' => $this->faker->paragraph,
            'maps'        => $this->faker->url,
            'wa'          => $this->faker->phoneNumber,
            'featured'    => $this->faker->boolean(20), // 20% chance of being featured
        ];
    }
}
