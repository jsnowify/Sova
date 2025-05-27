<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule; // For unique rule ignoring current post

class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // User can update a post if they own it, or if they are admin
        // This logic is better handled by Policies (see Step 7)
        // For now, let's assume an authenticated user can try.
        // Policy will handle the fine-grained check.
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $postId = $this->route('post')->id ?? null; // Get post ID from route

        return [
            'title' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('posts', 'title')->ignore($postId),
            ],
            'body' => 'sometimes|required|string',
            'image_path' => 'nullable|string|max:2048',
            'published_at' => 'nullable|date_format:Y-m-d H:i:s',
        ];
    }
}
