<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Guzzle Configuration
    |--------------------------------------------------------------------------
    |
    | This is the configuration for Guzzle HTTP client.
    |
    */

    'verify' => env('CURL_VERIFY_SSL_PEER', true),
];
