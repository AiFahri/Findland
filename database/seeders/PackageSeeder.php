<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Package;

class PackageSeeder extends Seeder
{
    public function run()
    {
        Package::insert([
            ['name' => 'Starter', 'price' => 334000, 'duration' => 1],
            ['name' => 'Enterprise', 'price' => 10, 'duration' => 3],
            ['name' => 'Lite', 'price' => 1900000, 'duration' => 6],
            ['name' => 'Pro', 'price' => 3800000, 'duration' => 12],
        ]);
    }
}

