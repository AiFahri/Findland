<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\LandListingController;
use App\Http\Controllers\PropertyListingController;



Route::get('/', [PropertyListingController::class, 'getHomeProperties'])->name('home');

Route::get('/tentangkami', function () {
    return Inertia::render('AboutsUs', [
        'reviews' => \App\Models\Review::with('user')->latest()->get()
    ]);
})->name('AboutsUs');
Route::get('/layanan/beli', [PropertyListingController::class, 'index'])
    ->defaults('status', 'Dijual')
    ->name('layanan.beli');

Route::get('/layanan/sewa', [PropertyListingController::class, 'index'])
    ->defaults('status', 'Disewa')
    ->name('layanan.sewa');

Route::get('/layanan/properti/{id}', [PropertyListingController::class, 'show'])->name('properties.show');

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
