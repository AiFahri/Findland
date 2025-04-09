<?php

namespace App\Http\Controllers;

use App\Models\LandListing;
use App\Models\Payment;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DirectPaymentController extends Controller
{

    public function showPaymentPage(LandListing $landListing)
    {
        try {

            if (Auth::id() !== $landListing->user_id) {
                Log::warning('Unauthorized payment attempt', [
                    'user_id' => Auth::id(),
                    'land_listing_id' => $landListing->id
                ]);
                return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk melakukan pembayaran ini.');
            }


            $package = Package::findOrFail($landListing->package_id);
            if (!$package) {
                Log::error('Package not found', [
                    'package_id' => $landListing->package_id,
                    'land_listing_id' => $landListing->id
                ]);
                return redirect()->back()->with('error', 'Paket tidak ditemukan.');
            }


            $payment = Payment::where('land_listing_id', $landListing->id)
                ->where('status', 'unpaid')
                ->first();


            if (!$payment) {
                $payment = Payment::create([
                    'id' => (string) Str::uuid(),
                    'user_id' => Auth::id(),
                    'package_id' => $package->id,
                    'land_listing_id' => $landListing->id,
                    'amount' => $package->price,
                    'status' => 'unpaid',
                ]);
            }


            $paymentData = [
                'order_id' => $payment->id,
                'gross_amount' => (int) $payment->amount,
                'first_name' => Auth::user()->first_name,
                'last_name' => Auth::user()->last_name,
                'email' => Auth::user()->email,
                'phone' => $landListing->phone_number,
                'item_id' => (string) $package->id,
                'item_name' => $package->name,
                'item_price' => (int) $package->price,
                'client_key' => config('midtrans.client_key'),
                'server_key' => config('midtrans.server_key'),
                'is_production' => config('midtrans.is_production'),
                'finish_url' => route('payments.finish', ['order_id' => $payment->id]),
                'unfinish_url' => route('payments.unfinish', ['order_id' => $payment->id]),
                'error_url' => route('payments.error', ['order_id' => $payment->id]),
            ];

            Log::info('Direct payment page accessed', [
                'payment_id' => $payment->id,
                'land_listing_id' => $landListing->id,
                'package_id' => $package->id,
                'amount' => $payment->amount
            ]);

            // Render halaman pembayaran langsung
            return Inertia::render('Payments/DirectPayment', [
                'payment' => $payment,
                'package' => $package,
                'landListing' => $landListing,
                'paymentData' => $paymentData,
                'clientKey' => config('midtrans.client_key')
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing direct payment page: ' . $e->getMessage(), [
                'land_listing_id' => $landListing->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.');
        }
    }


    public function updatePaymentStatus(Request $request)
    {
        try {
            $request->validate([
                'order_id' => 'required|string',
                'status' => 'required|string|in:success,pending,failed',
                'transaction_id' => 'nullable|string',
                'payment_type' => 'nullable|string',
            ]);

            $payment = Payment::find($request->order_id);

            if (!$payment) {
                return response()->json(['message' => 'Payment not found'], 404);
            }


            switch ($request->status) {
                case 'success':
                    $payment->status = 'paid';
                    $payment->paid_at = now();
                    break;
                case 'pending':
                    $payment->status = 'pending';
                    break;
                case 'failed':
                    $payment->status = 'failed';
                    break;
            }

            $payment->payment_type = $request->payment_type;
            $payment->save();


            if ($request->status === 'success') {
                $landListing = $payment->landListing;
                $package = $payment->package;

                if ($landListing && $package) {
                    $landListing->is_paid = true;
                    $landListing->expiry_date = now()->addDays($package->duration);
                    $landListing->save();
                }
            }

            Log::info('Payment status updated via frontend', [
                'payment_id' => $payment->id,
                'status' => $request->status,
                'transaction_id' => $request->transaction_id,
                'payment_type' => $request->payment_type
            ]);

            return response()->json(['message' => 'Payment status updated successfully']);
        } catch (\Exception $e) {
            Log::error('Error updating payment status: ' . $e->getMessage(), [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Error updating payment status'], 500);
        }
    }
}
