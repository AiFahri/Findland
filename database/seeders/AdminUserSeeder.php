<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        Admin::firstOrCreate(
            ['email' => 'admin@findland.com'],
            [
                'name' => 'Admin Utama',
                'password' => '123123123', 
                'role' => 'super_admin',
                'is_active' => true
            ]
        );
    }
}