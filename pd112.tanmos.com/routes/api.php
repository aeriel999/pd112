<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
Route::post('/categories/add', [CategoryController::class, 'insertData']);
Route::get('/categories/get/{id}', [CategoryController::class, 'getCategory']);
Route::post('/categories/update/{id}', [CategoryController::class, 'updateCategory']);
Route::post('/categories/delete/{id}', [CategoryController::class, 'deleteCategory']);

Route::get('/products', [ProductController::class, 'getList']);
Route::post('/products/add', [ProductController::class, 'createProduct']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);





