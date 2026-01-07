<?php
namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LandListingFactory extends Factory
{
    public function definition()
    {
        return [
            'user_id'          => User::factory(),
            'full_name'        => $this->faker->name(),
            'birth_place_date' => $this->faker->city() . ', ' . $this->faker->date(),
            'address'          => $this->faker->address(),
            'ktp_id'           => $this->faker->unique()->numerify('##############'),
            // 'religion'         => $this->faker->randomElement(['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha']),
            'phone_number'     => $this->faker->phoneNumber(),
            'npwp'             => $this->faker->numerify('##.###.###.#-###.###'),
            'ktp_scan'         => 'ktp/dummy.jpg',
            'package_id'       => $this->faker->numberBetween(1, 4),
            'land_photos'      => json_encode([
                'lands/dummy1.jpg',
                'lands/dummy2.jpg',
                'lands/dummy3.jpg',
                'lands/dummy4.jpg',
            ]),
            'admin_status'     => 'pending',
            'maps_link'        => $this->faker->url(), 
        ];
    }
}

