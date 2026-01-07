<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MidtransHelper
{
    /**
     * Get Snap Token from Midtrans API
     *
     * @param array $params
     * @return string|null
     */
    public static function getSnapToken(array $params)
    {
        try {
            $serverKey = config('midtrans.server_key');
            $isProduction = config('midtrans.is_production');

            $baseUrl = $isProduction
                ? 'https://app.midtrans.com/snap/v1/transactions'
                : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

            $auth = base64_encode($serverKey . ':');

            $httpOptions = [];
            if (!$isProduction) {
                $httpOptions['verify'] = false;
            }

            $response = Http::withOptions($httpOptions)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                    'Authorization' => 'Basic ' . $auth
                ])->post($baseUrl, $params);

            Log::info('Midtrans API Response', [
                'status' => $response->status(),
                'body' => $response->json(),
                'is_production' => $isProduction
            ]);

            if ($response->successful()) {
                $responseData = $response->json();
                return $responseData['token'] ?? null;
            }

            Log::error('Midtrans API Error', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Exception in getSnapToken: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }
}

