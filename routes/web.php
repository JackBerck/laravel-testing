<?php

use App\Http\Controllers\VulnerabilityController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::prefix('dvwa')->group(function () {
    // SQL Injection
    Route::get('/sql-injection/low', [VulnerabilityController::class, 'sqlInjectionLowView']);
    Route::post('/sql-injection/low', [VulnerabilityController::class, 'sqlInjectionLow']);

    Route::get('/sql-injection/medium', [VulnerabilityController::class, 'sqlInjectionMediumView']);
    Route::post('/sql-injection/medium', [VulnerabilityController::class, 'sqlInjectionMedium']);

    Route::get('/sql-injection/high', [VulnerabilityController::class, 'sqlInjectionHighView']);
    Route::post('/sql-injection/high', [VulnerabilityController::class, 'sqlInjectionHigh']);

    // XSS
    Route::get('/xss/low', [VulnerabilityController::class, 'xssLowView']);
    Route::post('/xss/low', [VulnerabilityController::class, 'xssLow']);

    Route::get('/xss/medium', [VulnerabilityController::class, 'xssMediumView']);
    Route::post('/xss/medium', [VulnerabilityController::class, 'xssMedium']);

    Route::get('/xss/high', [VulnerabilityController::class, 'xssHighView']);
    Route::post('/xss/high', [VulnerabilityController::class, 'xssHigh']);
});

require __DIR__ . '/settings.php';
