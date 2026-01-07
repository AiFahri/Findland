<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SnapTokenController extends Controller
{

    public function getSnapToken(Request $request)
    {
        try {
            $request->validate([
                'order_id' => 'required|string',
                'transaction_data' => 'required|array',
            ]);

            $payment = Payment::find($request->order_id);
            if (!$payment) {
                return response()->json(['error' => 'Payment not found'], 404);
            }

            $serverKey = config('midtrans.server_key');
            $isProduction = config('midtrans.is_production');

            $baseUrl = $isProduction
                ? 'https://app.midtrans.com/snap/v1/transactions'
                : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

            $auth = base64_encode($serverKey . ':');

            $response = Http::withOptions([
                'verify' => false,
            ])->withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'Authorization' => 'Basic ' . $auth
            ])->post($baseUrl, $request->transaction_data);

            Log::info('Midtrans API Response', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            if ($response->successful()) {
                $responseData = $response->json();
                $snapToken = $responseData['token'] ?? null;

                if ($snapToken) {
                    $payment->snap_token = $snapToken;
                    $payment->save();

                    return response()->json([
                        'snap_token' => $snapToken
                    ]);
                }
            }

            Log::error('Midtrans API Error', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            return response()->json(['error' => 'Failed to get Snap Token'], 500);
        } catch (\Exception $e) {
            Log::error('Error getting Snap Token: ' . $e->getMessage(), [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}


