<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PropertyListing;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        PropertyListing::query()->delete();

        // Generate 50 property listings
        PropertyListing::factory()->count(50)->create();
    }
}
