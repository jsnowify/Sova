<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function __construct()
    {
        // Apply policy to all resource methods, can be more granular
        // For 'index' and 'show', policy methods allow optional user (public access)
        // For 'store', 'update', 'destroy', user must be authenticated
        $this->authorizeResource(Post::class, 'post');
    }

    public function index(Request $request) // <-- Add Request $request here
    {
        // $this->authorize('viewAny', Post::class); // Still handled by authorizeResource for the Post model overall

        $query = Post::with('user:id,name')->latest('updated_at'); // Default query, order by latest updated

        // Get the authenticated user. For API routes with Sanctum, $request->user() is the way.
        $user = $request->user();

        // Check if the authenticated user is an admin or editor
        if ($user && in_array($user->role, ['admin', 'editor'])) {
            // Admins and Editors see all posts (no additional 'published_at' status filter)
            // They will see both published and unpublished (draft) posts.
        } else {
            // Public view (or users without admin/editor roles): only show published posts
            $query->whereNotNull('published_at')
                  ->where('published_at', '<=', now());
        }

        $posts = $query->paginate(10); // Apply pagination
        return response()->json($posts);
    }

    public function store(StorePostRequest $request)
    {
        // $this->authorize('create', Post::class); // Handled by authorizeResource

        $validatedData = $request->validated();
        $post = Auth::user()->posts()->create([
            'title' => $validatedData['title'],
            'body' => $validatedData['body'],
            'slug' => Str::slug($validatedData['title']),
            'published_at' => $validatedData['published_at'] ?? null,
            'image_path' => $validatedData['image_path'] ?? null,
        ]);
        return response()->json($post, 201);
    }

    public function show(Post $post) // Uses route model binding
    {
        $this->authorize('view', $post); // authorizeResource handles this

        return response()->json($post->load(['user:id,name', 'comments.user:id,name']));
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        // $this->authorize('update', $post); // Handled by authorizeResource

        $validatedData = $request->validated();
        if (isset($validatedData['title'])) {
            $validatedData['slug'] = Str::slug($validatedData['title']);
        }
        $post->update($validatedData);
        return response()->json($post->fresh());
    }

    public function destroy(Post $post)
    {
        // $this->authorize('delete', $post); // Handled by authorizeResource

        $post->delete();
        return response()->json(null, 204);
    }
}
