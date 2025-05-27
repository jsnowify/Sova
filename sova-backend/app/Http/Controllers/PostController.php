<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
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

    public function index()
    {
        // $this->authorize('viewAny', Post::class); // Handled by authorizeResource

        $posts = Post::with('user:id,name')
                     ->whereNotNull('published_at') // Only show published posts by default
                     ->where('published_at', '<=', now())
                     ->latest('published_at')
                     ->paginate(10);
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
