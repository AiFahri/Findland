<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PropertyController;
use App\Http\Controllers\LandListingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PropertyListingController;
use App\Http\Controllers\ReviewController;
use App\Http\Middleware\AdminAuthenticate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [PropertyListingController::class, 'getHomeProperties'])->name('home');

// Debug routes
Route::prefix('debug')->group(function () {
    // Debug route untuk memeriksa status autentikasi
    Route::get('/auth', function () {
        return response()->json([
            'is_logged_in' => Auth::check(),
            'user'         => Auth::check() ? Auth::user() : null,
            'session'      => session()->all(),
        ]);
    });

    // Debug route untuk memeriksa database users
    Route::get('/users', function () {
        return response()->json([
            'count' => \App\Models\User::count(),
            'users' => \App\Models\User::all(['id', 'first_name', 'last_name', 'email', 'google_id', 'is_google_account', 'created_at'])->toArray(),
        ]);
    });
});

Route::get('/tentangkami', function () {
    return Inertia::render('AboutsUs', [
        'reviews' => \App\Models\Review::with('user')->latest()->get(),
    ]);
})->name('AboutsUs');
Route::get('/layanan/beli', [PropertyListingController::class, 'index'])
    ->defaults('status', 'Dijual')
    ->name('layanan.beli');

Route::get('/layanan/sewa', [PropertyListingController::class, 'index'])
    ->defaults('status', 'Disewa')
    ->name('layanan.sewa');
Route::get('/layanan/jual', function () {
    return Inertia::render('Pricing');
})->name('layanan.jual');
Route::get('/layanan/properti/{id}', [PropertyListingController::class, 'show'])->name('properties.show');

Route::get('/faq', function () {
    return Inertia::render('Faq');
});
Route::middleware(['auth'])->group(function () {
    Route::post('/jual-lahan', [LandListingController::class, 'store'])->name('land.store');
    Route::get('/jual-lahan', [LandListingController::class, 'create'])->name('land.create');

    // // Admin approval routes
    // Route::middleware(['admin'])->group(function () {
    //     Route::patch('/jual-lahan/{id}/approve', [LandListingController::class, 'approve'])->name('land.approve');
    //     Route::patch('/jual-lahan/{id}/reject', [LandListingController::class, 'reject'])->name('land.reject');

    // });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::post('/profile/update-picture', [ProfileController::class, 'updateProfilePicture'])->name('profile.update.picture');

});

Route::prefix('admin')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/login', [AuthController::class, 'login'])->name('admin.login.attempt');
    Route::post('/logout', [AuthController::class, 'logout'])->name('admin.logout');

    // Route::middleware('auth:admin')->group(function () {
    //     Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

    //     // Property Management Routes
    //     Route::get('/properties/total', [PropertyController::class, 'totalListings'])
    //     ->name('admin.properties.total');
    // Route::get('/properties/pending', [PropertyController::class, 'pendingListings'])
    //     ->name('admin.properties.pending');
    // Route::get('/properties/{id}/review', [PropertyController::class, 'reviewListing'])
    //     ->name('admin.properties.review');
    // Route::post('/properties/{id}/approve', [PropertyController::class, 'approveListing'])
    //     ->name('admin.properties.approve');
    //     Route::get('/properties/active', [DashboardController::class, 'getActiveProperties'])
    //         ->name('admin.properties.active');

    // });
    Route::middleware([AdminAuthenticate::class])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

        // Property Routes
        Route::get('/properties/total', [PropertyController::class, 'totalListings'])
            ->name('admin.properties.total');
        Route::get('/properties/pending', [PropertyController::class, 'pendingListings'])
            ->name('admin.properties.pending');
        Route::get('/properties/{id}/review', [PropertyController::class, 'reviewListing'])
            ->name('admin.properties.review');
        Route::post('/properties/{id}/approve', [PropertyController::class, 'approveListing'])
            ->name('admin.properties.approve');
    });
});

require __DIR__ . '/auth.php';
