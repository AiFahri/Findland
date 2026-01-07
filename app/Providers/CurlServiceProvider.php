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
        if (app()->environment('local', 'development') && config('guzzle.verify') === false) {
            // Extend Socialite hanya jika dalam mode development
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
