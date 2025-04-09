<?php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class CurlServiceProvider extends ServiceProvider
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
        // Disable SSL verification for development
        if (config('guzzle.verify') === false) {
            // Extend Socialite to use custom Guzzle client
            \Laravel\Socialite\Facades\Socialite::extend('google', function ($app) {
                $config = $app['config']['services.google'];
                return new \Laravel\Socialite\Two\GoogleProvider(
                    $app['request'],
                    $config['client_id'],
                    $config['client_secret'],
                    $config['redirect'],
                    $config['options'] ?? []
                );
            });
        }
    }
}
