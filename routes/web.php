<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PropertyController;
use App\Http\Controllers\DirectPaymentController;
use App\Http\Controllers\LandListingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PropertyListingController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SnapTokenController;
use App\Http\Middleware\AdminAuthenticate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Artisan;

Route::get('/', [PropertyListingController::class, 'getHomeProperties'])->name('home');
Route::get('/tentangkami', [ReviewController::class, 'index'])->name('AboutsUs');
Route::get('/layanan/beli', [PropertyListingController::class, 'index'])
    ->defaults('status', 'Dijual')
    ->name('layanan.beli');

Route::get('/layanan/sewa', [PropertyListingController::class, 'index'])
    ->defaults('status', 'Disewa')
    ->name('layanan.sewa');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/layanan/jual', function () {
        return Inertia::render('Pricing');
    })->name('layanan.jual');
});
Route::get('/layanan/properti/{id}', [PropertyListingController::class, 'show'])->name('properties.show');

Route::get('/faq', function () {
    return Inertia::render('Faq');
});

Route::middleware(['auth'])->group(function () {
    Route::post('/jual-lahan', [LandListingController::class, 'store'])->name('land.store');
    Route::get('/jual-lahan', [LandListingController::class, 'create'])->name('land.create');

    // Payment routes
    Route::get('/payments/process/{landListing}', [DirectPaymentController::class, 'showPaymentPage'])->name('payments.process');
    Route::get('/payments/finish', [PaymentController::class, 'finish'])->name('payments.finish');
    Route::get('/payments/unfinish', [PaymentController::class, 'unfinish'])->name('payments.unfinish');
    Route::get('/payments/error', [PaymentController::class, 'error'])->name('payments.error');
    Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::get('/payments/{payment}', [PaymentController::class, 'show'])->name('payments.show');

    // // Admin approval routes
    // Route::middleware(['admin'])->group(function () {
    //     Route::patch('/jual-lahan/{id}/approve', [LandListingController::class, 'approve'])->name('land.approve');
    //     Route::patch('/jual-lahan/{id}/reject', [LandListingController::class, 'reject'])->name('land.reject');

    // });
});

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::post('/profile/update-picture', [ProfileController::class, 'updateProfilePicture'])->name('profile.update.picture');

});

Route::prefix('finadminofc')->group(function () {
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
        Route::post('/properties/upload-image', [PropertyController::class, 'uploadImage'])
            ->name('admin.properties.upload-image');
        Route::post('/properties/{id}/extend-expiry', [PropertyController::class, 'extendExpiry'])
            ->name('admin.properties.extend-expiry');
    });
});

// Midtrans Webhook (tidak perlu CSRF protection)
Route::post('/payments/webhook', [PaymentController::class, 'webhook'])->name('payments.webhook');
// API untuk update status pembayaran dari frontend
Route::post('/api/payments/update-status', [DirectPaymentController::class, 'updatePaymentStatus'])->name('api.payments.update-status');
// API untuk mendapatkan Snap Token dari Midtrans
Route::post('/api/payments/get-snap-token', [SnapTokenController::class, 'getSnapToken'])->name('api.payments.get-snap-token');

// Debug route untuk memeriksa keberadaan file gambar
Route::get('/debug/check-image', function () {
    $path    = request()->input('path');
    $results = [];
    $exists              = Storage::disk('public')->exists($path);
    $results['original'] = [
        'path'      => $path,
        'exists'    => $exists,
        'full_path' => Storage::disk('public')->path($path),
    ];

    $pathWithoutExt = preg_replace('/\.[^.]+$/', '', $path);
    $extensions     = ['jpg', 'jpeg', 'png', 'gif'];

    foreach ($extensions as $ext) {
        $testPath                  = $pathWithoutExt . '.' . $ext;
        $exists                    = Storage::disk('public')->exists($testPath);
        $results['alternatives'][] = [
            'path'      => $testPath,
            'exists'    => $exists,
            'full_path' => Storage::disk('public')->path($testPath),
        ];
    }
    Log::info('Image debug check', $results);

    return response()->json($results);
})->name('debug.check-image');

// Route untuk menampilkan daftar semua file di storage
Route::get('/debug/list-storage', function () {
    $directories = [
        'property'    => Storage::disk('public')->files('property'),
        'land_photos' => Storage::disk('public')->files('land_photos'),
        'assets'      => Storage::disk('public')->files(),
        'root'        => Storage::disk('public')->files('/'),
    ];
    Log::info('Storage directory listing', $directories);

    return response()->json($directories);
})->name('debug.list-storage');

Route::get('/sitemap.xml', function () {
    $properties = \App\Models\LandListing::all();
    $content = view('sitemap', compact('properties'));
    return response($content)->header('Content-Type', 'application/xml');
});

require __DIR__ . '/auth.php';

