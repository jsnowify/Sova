<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users or create some
        $users = User::all();
        if ($users->isEmpty()) {
            // Create a default admin user if one doesn't exist
            $adminUser = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'), // Change in production!
                'role' => 'admin',
            ]);
            // Create an editor user
            $editorUser = User::factory()->create([
                'name' => 'Editor User',
                'email' => 'editor@example.com',
                'password' => bcrypt('password'), // Change in production!
                'role' => 'editor',
            ]);
            $users = collect([$adminUser, $editorUser]);
        }


        // Create posts, and for each post, create some comments
        Post::factory(10)->recycle($users)->create()->each(function ($post) use ($users) {
            Comment::factory(rand(0, 5))->recycle($users)->for($post)->create();
        });
    }
}
