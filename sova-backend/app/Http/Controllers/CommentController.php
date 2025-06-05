<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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

        $validatedData = $request->validate([
            'body' => 'required|string|max:2000',
        ]);

        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated. Please log in to comment.'], 401);
        }

        try {
            $comment = $post->comments()->create([
                'body'    => $validatedData['body'],
                'user_id' => Auth::id(),
            ]);


            $comment->load('user:id,name');
            return response()->json($comment, 201);

        } catch (\Exception $e) {
            Log::error('Error creating comment: ' . $e->getMessage() . ' for post ID: ' . $post->id . ' by user ID: ' . Auth::id());
            Log::error($e->getTraceAsString());

            return response()->json(['message' => 'Failed to create comment due to a server error. Please try again later.'], 500);
        }
    }
}
