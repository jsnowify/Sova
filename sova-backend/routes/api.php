<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CommentController; // <--- ADD THIS IMPORT

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

// Publicly accessible routes for viewing posts
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post:slug}', [PostController::class, 'show']);

// Routes requiring authentication
Route::middleware('auth:sanctum')->group(function () {
    // User related
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']); // Keep only one logout route
    Route::get('/users', [UserController::class, 'index'])->middleware('admin');

    // Post management
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);

    // Comment creation
    Route::post('/posts/{post}/comments', [CommentController::class, 'store']); // <--- ADD THIS ROUTE
});

// Public authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Remove the duplicate logout route from here if you've kept the one inside the group
// Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
