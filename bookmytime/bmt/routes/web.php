<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LanguageController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Alap oldal
Route::get('/', function () {
    return view('welcome');
})->name('home');

// Beállítások oldal
Route::get('/settings', function () {
    return view('settings');
})->name('settings');

// Nyelvválasztás kezelése
Route::post('/change-language', [LanguageController::class, 'changeLanguage'])->name('change.language');
