<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Log;

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
    // This is the original /user route that should be here
    Route::get('/user', function (Request $request) {
        Log::info('Accessing /api/user. Authenticated user ID: ' . ($request->user() ? $request->user()->id : 'None'));
        if (!$request->user()) {
            Log::warning('/api/user: Request is unauthenticated or user could not be determined from token.');
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        return $request->user(); // Laravel automatically casts this to JSON
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/users', [UserController::class, 'index'])->middleware('admin');

    // Post management
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);

    // Comment creation
    Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
});

// Public authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
