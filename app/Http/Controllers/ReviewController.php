<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index()
{
    $reviews = Review::with('user')
        ->orderBy('rating', 'desc') 
        ->latest() 
        ->take(3) 
        ->get();

    return Inertia::render('AboutsUs', [
        'reviews' => $reviews
    ]);
}


    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:500',
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
