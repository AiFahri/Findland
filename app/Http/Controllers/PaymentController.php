<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Package;
use App\Models\LandListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;
use App\Helpers\MidtransHelper;

class PaymentController extends Controller
{
    public function __construct()
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        // Disable SSL verification for development
        Config::$curlOptions = [
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0
        ];
    }

    /**
     * Proses pembayaran setelah form land listing disubmit
     */
    public function processPayment(LandListing $landListing)
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

            $payment = Payment::create([
                'id' => (string) Str::uuid(),
                'user_id' => Auth::id(),
                'package_id' => $package->id,
                'land_listing_id' => $landListing->id,
                'amount' => $package->price,
                'status' => 'unpaid',
            ]);

            $params = [
                'transaction_details' => [
                    'order_id' => $payment->id,
                    'gross_amount' => (int) $payment->amount,
                ],
                'customer_details' => [
                    'first_name' => Auth::user()->first_name,
                    'last_name' => Auth::user()->last_name,
                    'email' => Auth::user()->email,
                    'phone' => $landListing->phone_number,
                ],
                'item_details' => [
                    [
                        'id' => (string) $package->id,
                        'price' => (int) $package->price,
                        'quantity' => 1,
                        'name' => $package->name,
                    ]
                ],
            ];

            if (config('midtrans.finish_redirect_url')) {
                $params['callbacks'] = [
                    'finish' => config('midtrans.finish_redirect_url') . '?order_id=' . $payment->id,
                    'unfinish' => config('midtrans.unfinish_redirect_url') . '?order_id=' . $payment->id,
                    'error' => config('midtrans.error_redirect_url') . '?order_id=' . $payment->id,
                ];
            }

            Log::info('Midtrans parameters', [
                'params' => $params
            ]);

            try {
                $snapToken = MidtransHelper::getSnapToken($params);

                if ($snapToken) {
                    $payment->snap_token = $snapToken;
                    $payment->save();

                    Log::info('Payment created successfully', [
                        'payment_id' => $payment->id,
                        'land_listing_id' => $landListing->id,
                        'package_id' => $package->id,
                        'amount' => $payment->amount
                    ]);

                    // Log untuk debugging
                    Log::info('Snap Token generated successfully', [
                        'snap_token' => $snapToken,
                        'client_key' => config('midtrans.client_key')
                    ]);

                    return Inertia::render('Payments/Checkout', [
                        'payment' => $payment,
                        'package' => $package,
                        'landListing' => $landListing,
                        'snapToken' => $snapToken,
                        'clientKey' => config('midtrans.client_key')
                    ]);
                } else {
                    Log::error('Failed to get Snap Token', [
                        'payment_id' => $payment->id,
                        'params' => $params
                    ]);

                    return Inertia::render('Payments/Checkout', [
                        'payment' => $payment,
                        'package' => $package,
                        'landListing' => $landListing,
                        'snapToken' => 'development-fallback-token',
                        'clientKey' => config('midtrans.client_key'),
                        'error' => 'Terjadi kesalahan saat menghubungi Midtrans. Silakan coba lagi nanti atau hubungi customer service.'
                    ]);
                }
            } catch (\Exception $midtransError) {
                Log::error('Midtrans Error: ' . $midtransError->getMessage(), [
                    'payment_id' => $payment->id,
                    'error' => $midtransError->getMessage(),
                    'error_code' => $midtransError->getCode(),
                    'trace' => $midtransError->getTraceAsString(),
                    'params' => $params
                ]);

                if (strpos($midtransError->getMessage(), 'Undefined array key 10023') !== false) {
                    Log::info('Mencoba memperbaiki parameter Midtrans untuk error 10023');

                    unset($params['callbacks']);
                    unset($params['credit_card']);

                    try {
                        $snapToken = Snap::getSnapToken($params);

                        $payment->snap_token = $snapToken;
                        $payment->save();

                        Log::info('Berhasil mendapatkan Snap Token setelah memperbaiki parameter', [
                            'snap_token' => $snapToken
                        ]);

                        return Inertia::render('Payments/Checkout', [
                            'payment' => $payment,
                            'package' => $package,
                            'landListing' => $landListing,
                            'snapToken' => $snapToken,
                            'clientKey' => config('midtrans.client_key')
                        ]);
                    } catch (\Exception $retryError) {
                        Log::error('Midtrans Retry Error: ' . $retryError->getMessage(), [
                            'payment_id' => $payment->id,
                            'error' => $retryError->getMessage(),
                            'trace' => $retryError->getTraceAsString(),
                            'simplified_params' => $params
                        ]);

                        // Fallback untuk development - tampilkan halaman pembayaran tanpa Snap Token
                        return Inertia::render('Payments/Checkout', [
                            'payment' => $payment,
                            'package' => $package,
                            'landListing' => $landListing,
                            'snapToken' => 'development-fallback-token',
                            'clientKey' => config('midtrans.client_key'),
                            'error' => 'Terjadi kesalahan saat menghubungi Midtrans. Silakan coba lagi nanti atau hubungi customer service.'
                        ]);
                    }
                }

                // Fallback untuk development - tampilkan halaman pembayaran tanpa Snap Token
                return Inertia::render('Payments/Checkout', [
                    'payment' => $payment,
                    'package' => $package,
                    'landListing' => $landListing,
                    'snapToken' => 'development-fallback-token',
                    'clientKey' => config('midtrans.client_key'),
                    'error' => 'Terjadi kesalahan saat menghubungi Midtrans: ' . $midtransError->getMessage()
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error processing payment: ' . $e->getMessage(), [
                'land_listing_id' => $landListing->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.');
        }
    }

    /**
     * Webhook untuk menerima notifikasi dari Midtrans
     */
    public function webhook(Request $request)
    {
        try {
            $notification = new Notification();

            Log::info('Midtrans Notification Received', [
                'payload' => $request->all()
            ]);

            $transactionStatus = $notification->transaction_status;
            $paymentType = $notification->payment_type;
            $orderId = $notification->order_id;
            $fraudStatus = $notification->fraud_status;

            $payment = Payment::find($orderId);

            if (!$payment) {
                Log::error('Payment not found in webhook', [
                    'order_id' => $orderId
                ]);
                return response()->json(['message' => 'Payment not found'], 404);
            }

            Log::info('Processing payment status update', [
                'payment_id' => $payment->id,
                'transaction_status' => $transactionStatus,
                'payment_type' => $paymentType,
                'fraud_status' => $fraudStatus
            ]);

            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'challenge') {
                    $payment->status = 'pending';
                } else if ($fraudStatus == 'accept') {
                    $payment->status = 'paid';
                    $payment->paid_at = now();
                    $this->updateLandListingStatus($payment);
                }
            } else if ($transactionStatus == 'settlement') {
                // Pembayaran sukses
                $payment->status = 'paid';
                $payment->paid_at = now();
                $this->updateLandListingStatus($payment);
            } else if ($transactionStatus == 'pending') {
                // Pembayaran pending
                $payment->status = 'pending';
            } else if ($transactionStatus == 'deny') {
                // Pembayaran ditolak
                $payment->status = 'denied';
            } else if ($transactionStatus == 'expire') {
                // Pembayaran expired
                $payment->status = 'expired';
                $payment->expired_at = now();
            } else if ($transactionStatus == 'cancel') {
                // Pembayaran dibatalkan
                $payment->status = 'failed';
            }

            $payment->payment_type = $paymentType;
            $payment->save();

            Log::info('Payment status updated successfully', [
                'payment_id' => $payment->id,
                'new_status' => $payment->status
            ]);

            return response()->json(['message' => 'Notification processed successfully']);
        } catch (\Exception $e) {
            Log::error('Error processing webhook: ' . $e->getMessage(), [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Error processing notification'], 500);
        }
    }

    /**
     * Update status land listing setelah pembayaran berhasil
     */
    private function updateLandListingStatus(Payment $payment)
    {
        try {
            $landListing = $payment->landListing;
            $package = $payment->package;

            if ($landListing && $package) {
                $landListing->is_paid = true;
                $landListing->expiry_date = now()->addDays($package->duration);
                $landListing->save();

                Log::info('Land listing status updated after payment', [
                    'land_listing_id' => $landListing->id,
                    'is_paid' => true,
                    'expiry_date' => $landListing->expiry_date
                ]);
            } else {
                Log::warning('Could not update land listing status', [
                    'payment_id' => $payment->id,
                    'land_listing_exists' => (bool) $landListing,
                    'package_exists' => (bool) $package
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error updating land listing status: ' . $e->getMessage(), [
                'payment_id' => $payment->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Halaman setelah pembayaran selesai
     */
    public function finish(Request $request)
    {
        $orderId = $request->order_id;
        $payment = Payment::with(['package', 'landListing'])->find($orderId);

        if (!$payment) {
            Log::warning('Payment not found in finish page', [
                'order_id' => $orderId
            ]);
            return redirect()->route('dashboard')->with('error', 'Pembayaran tidak ditemukan');
        }

        Log::info('User redirected to finish page', [
            'payment_id' => $payment->id,
            'status' => $payment->status
        ]);

        return Inertia::render('Payments/Finish', [
            'payment' => $payment,
            'package' => $payment->package,
            'landListing' => $payment->landListing
        ]);
    }

    /**
     * Halaman jika pembayaran tidak selesai
     */
    public function unfinish(Request $request)
    {
        $orderId = $request->order_id;
        $payment = Payment::with(['package', 'landListing'])->find($orderId);

        if (!$payment) {
            Log::warning('Payment not found in unfinish page', [
                'order_id' => $orderId
            ]);
            return redirect()->route('dashboard')->with('error', 'Pembayaran tidak ditemukan');
        }

        Log::info('User redirected to unfinish page', [
            'payment_id' => $payment->id,
            'status' => $payment->status
        ]);

        return Inertia::render('Payments/Unfinish', [
            'payment' => $payment,
            'package' => $payment->package,
            'landListing' => $payment->landListing
        ]);
    }

    /**
     * Halaman jika pembayaran error
     */
    public function error(Request $request)
    {
        $orderId = $request->order_id;
        $payment = Payment::with(['package', 'landListing'])->find($orderId);

        if (!$payment) {
            Log::warning('Payment not found in error page', [
                'order_id' => $orderId
            ]);
            return redirect()->route('dashboard')->with('error', 'Pembayaran tidak ditemukan');
        }

        Log::info('User redirected to error page', [
            'payment_id' => $payment->id,
            'status' => $payment->status
        ]);

        return Inertia::render('Payments/Error', [
            'payment' => $payment,
            'package' => $payment->package,
            'landListing' => $payment->landListing
        ]);
    }

    /**
     * Daftar pembayaran user
     */
    public function index()
    {
        $payments = Payment::with(['package', 'landListing'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Payments/Index', [
            'payments' => $payments
        ]);
    }

    /**
     * Detail pembayaran
     */
    public function show(Payment $payment)
    {
        if (Auth::id() !== $payment->user_id) {
            Log::warning('Unauthorized payment view attempt', [
                'user_id' => Auth::id(),
                'payment_id' => $payment->id
            ]);
            return redirect()->route('dashboard')->with('error', 'Anda tidak memiliki akses untuk melihat pembayaran ini.');
        }

        $payment->load(['package', 'landListing']);

        return Inertia::render('Payments/Show', [
            'payment' => $payment,
            'package' => $payment->package,
            'landListing' => $payment->landListing
        ]);
    }
}
