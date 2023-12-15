<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/categories', [CategoryController::class, 'getList']);
Route::post('/addcategory', [CategoryController::class, 'insertData']);
// routes/web.php or routes/api.php
//Route::post('/api/addcategory', 'App\Http\Controllers\Api\CategoryController');
