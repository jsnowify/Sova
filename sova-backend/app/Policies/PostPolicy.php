<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    /**
     * Determine whether the user can view any models.
     * (Everyone can view a list of posts)
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     * (Everyone can view a single post if it's published, or if they own it/are admin)
     */
    public function view(?User $user, Post $post): bool
    {
        if ($post->published_at && $post->published_at->isPast()) {
            return true; // Published posts are public
        }
        // Authenticated users can view their own unpublished posts or if they are admin
        return $user && ($user->id === $post->user_id || $user->role === 'admin');
    }

    /**
     * Determine whether the user can create models.
     * (Any authenticated user can create a post - you might restrict by role e.g. 'editor' or 'admin')
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['editor', 'admin']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Post $post): bool
    {
        // User can update their own post or if they are an admin
        return $user->id === $post->user_id || $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Post $post): bool
    {
        // User can delete their own post or if they are an admin
        return $user->id === $post->user_id || $user->role === 'admin';
    }

    /**
     * Determine whether the user can restore the model. (If using soft deletes)
     */
    // public function restore(User $user, Post $post): bool
    // {
    //     return $user->role === 'admin';
    // }

    /**
     * Determine whether the user can permanently delete the model. (If using soft deletes)
     */
    // public function forceDelete(User $user, Post $post): bool
    // {
    //     return $user->role === 'admin';
    // }
}
