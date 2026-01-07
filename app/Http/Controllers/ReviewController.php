<?php
namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with('user')
            ->orderBy('rating', 'desc')
            ->latest()
            ->take(3)
            ->get();

        $canReview     = false;
        $reviewMessage = '';
        $userId        = Auth::check() ? Auth::id() : 'Not logged in';
        $paidUsers = DB::select("SELECT DISTINCT user_id FROM payments WHERE status = 'paid'");
        $allPaidPayments = DB::select("SELECT id, user_id, status, amount, created_at, paid_at FROM payments WHERE status = 'paid'");

        $debugInfo = [
            'paid_users'              => $paidUsers,
            'all_paid_payments'       => $allPaidPayments,
            'current_user_id'         => $userId,
            'current_user_can_review' => false,
        ];

        Log::info('Users with paid payments (outside Auth check)', $debugInfo);

        if (Auth::check()) {
            // Menggunakan userId yang sudah didefinisikan di atas
            // Cek apakah user sudah pernah melakukan pembayaran berhasil
            // Hanya cek status 'paid' di tabel payments
            $hasPaidPayment = Payment::where('user_id', $userId)
                ->where('status', 'paid')
                ->exists();

            // Tampilkan semua user yang sudah melakukan pembayaran dengan status 'paid'
            $paidUsers = DB::select("SELECT DISTINCT user_id FROM payments WHERE status = 'paid'");

            // Tampilkan semua pembayaran dengan status 'paid' untuk debugging
            $allPaidPayments = DB::select("SELECT id, user_id, status, amount, created_at, paid_at FROM payments WHERE status = 'paid'");
            $debugInfo['current_user_can_review'] = $hasPaidPayment;

            Log::info('Users with paid payments (inside Auth check)', $debugInfo);

            // Tampilkan detail pembayaran untuk user saat ini jika ada
            $userPayments = Payment::where('user_id', $userId)->get();
            if ($userPayments->count() > 0) {
                Log::info('Current user payments', [
                    'user_id'  => $userId,
                    'payments' => $userPayments->map(function ($p) {
                        return [
                            'id'         => $p->id,
                            'status'     => $p->status,
                            'amount'     => $p->amount,
                            'created_at' => $p->created_at,
                            'paid_at'    => $p->paid_at,
                        ];
                    }),
                ]);
            }

            // Tidak perlu memeriksa land_listings lagi
            // Hanya gunakan hasil dari pemeriksaan payments
            $canReview = $hasPaidPayment;

            // Log untuk debugging
            Log::info('Review permission check', [
                'user_id'          => $userId,
                'has_paid_payment' => $hasPaidPayment,
                'can_review'       => $canReview,
            ]);

            if (! $canReview) {
                $reviewMessage = 'Anda harus melakukan pembayaran untuk bisa menggunakan fitur ini!';
            }
        } else {
            $reviewMessage = 'Silakan login untuk memberikan ulasan.';
        }

        // Gunakan debugInfo yang sudah didefinisikan di atas

        return Inertia::render('AboutsUs', [
            'reviews'       => $reviews,
            'canReview'     => $canReview,
            'reviewMessage' => $reviewMessage,
            'debugInfo'     => [
                'paid_users'        => $paidUsers,
                'all_paid_payments' => $allPaidPayments,
                'current_user_id'   => $userId,
                'can_review'        => $canReview,
            ],
        ]);
    }

    public function store(Request $request)
    {
        // Validasi apakah user sudah login
        if (! Auth::check()) {
            return response()->json(['message' => 'Anda harus login untuk memberikan ulasan.'], 403);
        }

        $userId = Auth::id();

        // Cek apakah user sudah pernah melakukan pembayaran berhasil
        // Hanya cek status 'paid' di tabel payments
        $hasPaidPayment = Payment::where('user_id', $userId)
            ->where('status', 'paid')
            ->exists();

        // Tampilkan semua user yang sudah melakukan pembayaran dengan status 'paid'
        $paidUsers = DB::select("SELECT DISTINCT user_id FROM payments WHERE status = 'paid'");
        Log::info('Users with paid payments (store method)', [
            'paid_users'              => $paidUsers,
            'current_user_id'         => $userId,
            'current_user_can_review' => $hasPaidPayment,
        ]);

        // Tampilkan detail pembayaran untuk user saat ini jika ada
        $userPayments = Payment::where('user_id', $userId)->get();
        if ($userPayments->count() > 0) {
            Log::info('Current user payments (store method)', [
                'user_id'  => $userId,
                'payments' => $userPayments->map(function ($p) {
                    return [
                        'id'         => $p->id,
                        'status'     => $p->status,
                        'amount'     => $p->amount,
                        'created_at' => $p->created_at,
                        'paid_at'    => $p->paid_at,
                    ];
                }),
            ]);
        }

        if (! $hasPaidPayment) {
            Log::warning('Unauthorized review attempt', [
                'user_id' => $userId,
                'message' => 'User tried to submit review without payment',
            ]);
            return response()->json(['message' => 'Anda harus melakukan pembayaran untuk bisa menggunakan fitur ini!'], 403);
        }

        $request->validate([
            'content' => 'required|string|min:10|max:200',
            'rating'  => 'required|integer|min:1|max:5',
        ]);

        Review::create([
            'user_id' => Auth::id(),
            'content' => $request->content,
            'rating'  => $request->rating,
        ]);

        return redirect()->back();
    }
}
