<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'address' => $this->faker->address(),
            'email_verified_at' => now(),
            'password' => '$2y$12$lpl6S6hwxOm42vQQtEz7femxnj6IyDmok2OS21yzHL.yFC.BTQqsK', // password
            'remember_token' => Str::random(10),
            'profile_picture' => null,
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}

