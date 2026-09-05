<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        $canReview = false;
        $reviewMessage = '';

        if (Auth::check()) {
            $hasPaidPayment = Payment::where('user_id', Auth::id())
                ->where('status', 'paid')
                ->exists();
            $canReview = $hasPaidPayment;

            if (! $canReview) {
                $reviewMessage = 'Anda harus melakukan pembayaran untuk bisa menggunakan fitur ini!';
            }
        } else {
            $reviewMessage = 'Silakan login untuk memberikan ulasan.';
        }

        return Inertia::render('AboutsUs', [
            'reviews' => $reviews,
            'canReview' => $canReview,
            'reviewMessage' => $reviewMessage,
        ]);
    }

    public function store(Request $request)
    {
        // Validasi apakah user sudah login
        if (! Auth::check()) {
            return response()->json(['message' => 'Anda harus login untuk memberikan ulasan.'], 403);
        }

        $userId = Auth::id();

        $hasPaidPayment = Payment::where('user_id', $userId)
            ->where('status', 'paid')
            ->exists();

        if (! $hasPaidPayment) {
            return response()->json(['message' => 'Anda harus melakukan pembayaran untuk bisa menggunakan fitur ini!'], 403);
        }

        $request->validate([
            'content' => 'required|string|min:10|max:200',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        Review::create([
            'user_id' => Auth::id(),
            'content' => $request->content,
            'rating' => $request->rating,
        ]);

        return redirect()->back();
    }
}
