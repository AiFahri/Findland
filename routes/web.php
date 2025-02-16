<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\LandListingController;



Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        
    ]);
});
Route::get('/tentangkami', function () {
    return Inertia::render('AboutsUs', [
        'reviews' => \App\Models\Review::with('user')->latest()->get()
    ]);
})->name('AboutsUs');
Route::get('/layanan/beli', function () {
    return Inertia::render('Layanan/Beli');
})->name('layanan.beli');

Route::get('/layanan/jual', function () {
    return Inertia::render('Pricing');
})->name('layanan.jual');

Route::get('/layanan/sewa', function () {
    return Inertia::render('Layanan/Sewa');
})->name('layanan.sewa');

Route::get('/faq', function () {
    return Inertia::render('Faq');
});
Route::middleware(['auth'])->group(function () {
    Route::post('/jual-lahan', [LandListingController::class, 'store'])->name('land.store');
    Route::get('/jual-lahan', [LandListingController::class, 'create'])->name('land.create');

    // Admin approval routes
    Route::middleware(['admin'])->group(function () {
        Route::patch('/jual-lahan/{id}/approve', [LandListingController::class, 'approve'])->name('land.approve');
        Route::patch('/jual-lahan/{id}/reject', [LandListingController::class, 'reject'])->name('land.reject');
    
    });
});


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::post('/profile/update-picture', [ProfileController::class, 'updateProfilePicture'])->name('profile.update.picture');
  

});


require __DIR__.'/auth.php';
