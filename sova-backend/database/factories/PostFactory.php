<?php

namespace Database\Factories;

use App\Models\User; // Import User model
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str; // Import Str

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(rand(5, 10));
        return [
            'user_id' => User::factory(), // Creates a user or use User::all()->random()->id; if users exist
            'title' => $title,
            'slug' => Str::slug($title),
            'body' => $this->faker->paragraphs(rand(5, 15), true),
            'image_path' => null, // Or $this->faker->imageUrl(640, 480, 'animals', true),
            'published_at' => $this->faker->optional(0.8, null)->dateTimeThisYear(), // 80% chance to be published
        ];
    }
}
