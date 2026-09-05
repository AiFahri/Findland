<?php

use App\Models\User;

test('authentication credentials stay out of serialized user payloads', function () {
    $user = new User;
    $user->setRawAttributes([
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => 'secret-password',
        'remember_token' => 'remember-me',
    ]);

    expect($user->toArray())
        ->not->toHaveKeys(['password', 'remember_token']);
});
