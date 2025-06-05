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
        $this->authorizeResource(Post::class, 'post');
    }

    public function index(Request $request)
    {

        $query = Post::with('user:id,name')->latest('updated_at');

        $user = $request->user();

        if ($user && in_array($user->role, ['admin', 'editor'])) {

        } else {

            $query->whereNotNull('published_at')
                  ->where('published_at', '<=', now());
        }

        $posts = $query->paginate(10);
        return response()->json($posts);
    }

    public function store(StorePostRequest $request)
    {


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

    public function show(Post $post)
    {
        $this->authorize('view', $post);

        return response()->json($post->load(['user:id,name', 'comments.user:id,name']));
    }

    public function update(UpdatePostRequest $request, Post $post)
    {


        $validatedData = $request->validated();
        if (isset($validatedData['title'])) {
            $validatedData['slug'] = Str::slug($validatedData['title']);
        }
        $post->update($validatedData);
        return response()->json($post->fresh());
    }

    public function destroy(Post $post)
    {


        $post->delete();
        return response()->json(null, 204);
    }
}
