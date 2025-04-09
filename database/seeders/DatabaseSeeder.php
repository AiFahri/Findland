<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            PackageSeeder::class,
            AdminUserSeeder::class,
        ]);

        if (app()->environment('local', 'development')) {
            \App\Models\User::factory(5)->create()->each(function ($user) {
                \App\Models\LandListing::factory()
                    ->count(2)
                    ->create([
                        'user_id' => $user->id,
                        'admin_status' => 'approved'
                    ]);
            });

            \App\Models\LandListing::where('admin_status', 'approved')
                ->get()
                ->each(function ($landListing) {
                    \App\Models\PropertyListing::factory()->create([
                        'land_listing_id' => $landListing->id,
                        'user_id' => $landListing->user_id
                    ]);
                });
        }
    }
}

