<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('AboutUs', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::get('/tentangkami', function () {
    return Inertia::render('AboutUs');
});
Route::get('/layanan/beli', function () {
    return Inertia::render('Layanan/Beli');
})->name('layanan.beli');

Route::get('/layanan/jual', function () {
    return Inertia::render('Layanan/Jual');
})->name('layanan.jual');

Route::get('/layanan/sewa', function () {
    return Inertia::render('Layanan/Sewa');
})->name('layanan.sewa');

Route::get('/faq', function () {
    return Inertia::render('Faq');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
