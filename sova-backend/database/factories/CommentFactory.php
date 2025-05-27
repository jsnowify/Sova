<?php

namespace Database\Factories;

use App\Models\Post; // Import Post model
use App\Models\User; // Import User model
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'post_id' => Post::factory(), // Or Post::all()->random()->id; if posts exist
            'user_id' => User::factory(), // Or User::all()->random()->id; if users exist
            'body' => $this->faker->paragraph(rand(1, 5)),
        ];
    }
}
