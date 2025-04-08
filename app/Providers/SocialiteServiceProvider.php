<?php

namespace App\Providers;

use GuzzleHttp\Client;
use Illuminate\Support\ServiceProvider;
use Laravel\Socialite\Contracts\Factory;

class SocialiteServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $socialite = $this->app->make(Factory::class);

        $socialite->extend('google', function () use ($socialite) {
            $googleConfig = config('services.google');

            // Create a Guzzle client with SSL verification disabled
            $client = new Client([
                'verify' => false, // Disable SSL verification for development
            ]);

            $provider = $socialite->buildProvider(
                \Laravel\Socialite\Two\GoogleProvider::class,
                $googleConfig
            );

            $provider->setHttpClient($client);

            return $provider;
        });
    }
}
