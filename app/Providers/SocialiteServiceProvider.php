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
            
            $clientOptions = [];
            if (app()->environment('local', 'development') && config('guzzle.verify') === false) {
                $clientOptions['verify'] = false;
            }
            
            $client = !empty($clientOptions) ? new Client($clientOptions) : null;
            
            $provider = $socialite->buildProvider(
                \Laravel\Socialite\Two\GoogleProvider::class,
                $googleConfig
            );
            if ($client) {
                $provider->setHttpClient($client);
            }
            
            return $provider;
        });
    }
}

