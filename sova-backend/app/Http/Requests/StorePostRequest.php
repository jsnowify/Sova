<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Anyone authenticated can attempt to create a post (can be refined with roles/permissions)
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255|unique:posts,title', // Unique title
            'body' => 'required|string',
            'image_path' => 'nullable|string|max:2048', // Example for path, or 'image|mimes:jpg,png|max:2048' if uploading file
            'published_at' => 'nullable|date_format:Y-m-d H:i:s',
            // Add rules for category_id, tags if you implement them
        ];
    }

    /**
     * Prepare the data for validation.
     */
    // protected function prepareForValidation(): void
    // {
    //     if ($this->title) {
    //         $this->merge([
    //             'slug' => Str::slug($this->title),
    //         ]);
    //     }
    // }
}
