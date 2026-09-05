<?php

use App\Models\LandListing;
use App\Models\Package;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('the payment page never exposes the Midtrans server key', function () {
    config()->set('midtrans.server_key', 'server-secret');

    $user = User::factory()->create();
    $package = Package::create([
        'name' => 'Starter',
        'price' => 334000,
        'duration' => 1,
    ]);
    $listing = LandListing::create([
        'user_id' => $user->id,
        'full_name' => $user->name,
        'birth_place_date' => 'Malang, 1 January 2000',
        'address' => 'Malang, Indonesia',
        'ktp_id' => '3500000000000001',
        'phone_number' => '081234567890',
        'npwp' => '000000000000001',
        'ktp_scan' => 'private/ktp.jpg',
        'package_id' => $package->id,
        'land_photos' => [],
        'status' => 'Dijual',
    ]);

    $this->actingAs($user)
        ->get(route('payments.process', $listing))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Payments/DirectPayment')
            ->missing('paymentData.server_key'));
});
