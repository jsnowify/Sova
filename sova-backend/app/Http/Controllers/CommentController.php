<?php

namespace App\Http\Controllers;

use App\Models\Post;      // Import the Post model
use App\Models\Comment;    // Import the Comment model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Import Auth to get the authenticated user
use Illuminate\Support\Facades\Log;   // Optional: For logging errors

class CommentController extends Controller
{
    /**
     * Store a newly created comment in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Post  $post // Route model binding for the post
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, Post $post)
    {
        // 1. Validate the incoming request data
        $validatedData = $request->validate([
            'body' => 'required|string|max:2000', // Ensure 'body' matches what frontend sends
        ]);

        // 2. Check if the user is authenticated
        if (!Auth::check()) {
            // This should ideally be caught by the 'auth:sanctum' middleware
            return response()->json(['message' => 'Unauthenticated. Please log in to comment.'], 401);
        }

        try {
            // 3. Create the comment and associate it with the post and authenticated user
            $comment = $post->comments()->create([
                'body'    => $validatedData['body'],
                'user_id' => Auth::id(), // Get ID of the currently authenticated user
            ]);

            // 4. Eager load the user relationship for the response to include user details
            $comment->load('user:id,name'); // Select specific columns for the user

            return response()->json($comment, 201); // 201 Created with the new comment

        } catch (\Exception $e) {
            // 5. Catch any other exceptions during comment creation
            Log::error('Error creating comment: ' . $e->getMessage() . ' for post ID: ' . $post->id . ' by user ID: ' . Auth::id());
            Log::error($e->getTraceAsString()); // Log stack trace for more details

            // Return a generic JSON error response
            return response()->json(['message' => 'Failed to create comment due to a server error. Please try again later.'], 500);
        }
    }
}
