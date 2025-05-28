import { apiRequest, getToken } from "../utils/api"; // Adjust path if your api.js is elsewhere

const BASE_URL = "/posts"; // Corresponds to your API routes for posts

/**
 * Fetches a list of all published posts.
 * API endpoint: GET /api/posts
 */
export const getAllPosts = async (page = 1) => {
  try {
    const response = await apiRequest(`${BASE_URL}?page=${page}`, "GET");
    if (response.ok) {
      return response.data; // Assuming Laravel pagination structure
    } else {
      throw new Error(response.data?.message || "Failed to fetch posts");
    }
  } catch (error) {
    console.error("Error fetching all posts:", error);
    throw error;
  }
};

/**
 * Fetches a single post by its slug.
 * API endpoint: GET /api/posts/{slug}
 */
export const getPostBySlug = async (slug) => {
  try {
    const response = await apiRequest(`${BASE_URL}/${slug}`, "GET");
    if (response.ok) {
      return response.data;
    } else {
      throw new Error(
        response.data?.message || `Failed to fetch post: ${slug}`
      );
    }
  } catch (error) {
    console.error(`Error fetching post by slug ${slug}:`, error);
    throw error;
  }
};
/**
 * Creates a new comment for a given post.
 * API endpoint: POST /api/posts/{postId}/comments
 * @param {number} postId - The ID of the post to comment on.
 * @param {string} commentBody - The text of the comment.
 */
export const createComment = async (postId, commentBody) => {
  try {
    // Ensure you have a token if your apiRequest requires it for POST requests
    // The apiRequest function you showed earlier includes the Authorization header.
    const response = await apiRequest(`/posts/${postId}/comments`, "POST", {
      body: commentBody,
    });
    if (response.ok) {
      return response.data; // The newly created comment with user info
    } else {
      throw new Error(response.data?.message || "Failed to post comment");
    }
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

/**
 * Creates a new blog post.
 * API endpoint: POST /api/posts
 * @param {object} postData - The data for the new post.
 * Expected fields: title, body, image_path (optional), published_at (optional)
 */
export const createPost = async (postData) => {
  try {
    // The apiRequest function should handle including the auth token
    const response = await apiRequest("/posts", "POST", postData);
    if (response.ok) {
      return response.data; // The newly created post
    } else {
      // Handle errors, response.data might contain validation messages or other errors
      throw new Error(response.data?.message || "Failed to create post");
    }
  } catch (error) {
    console.error("Error creating post:", error);
    // It's good to check if error.response exists for more detailed API errors
    if (error.response && error.response.data && error.response.data.errors) {
      // Handle Laravel validation errors
      throw {
        validationErrors: error.response.data.errors,
        message: error.response.data.message || "Validation failed",
      };
    }
    throw error;
  }
};

/**
 * Updates an existing post.
 * API endpoint: PUT /api/posts/{postId}
 * @param {number|string} postId - The ID of the post to update.
 * @param {object} postData - The data to update the post with.
 */
export const updatePost = async (postId, postData) => {
  try {
    // The 'PUT' method is used here. Your backend route Route::put('/posts/{post}', ...) expects PUT.
    const response = await apiRequest(`${BASE_URL}/${postId}`, "PUT", postData);
    if (response.ok) {
      return response.data; // The updated post
    } else {
      // Handle errors, response.data might contain validation messages or other errors
      const errorData = response.data || { message: "Failed to update post" };
      if (response.status === 422 && errorData.errors) {
        // Specifically handle Laravel validation errors
        throw {
          validationErrors: errorData.errors,
          message: errorData.message || "Validation failed",
        };
      }
      throw new Error(
        errorData.message ||
          `Failed to update post (status: ${response.status})`
      );
    }
  } catch (error) {
    console.error(`Error updating post ${postId}:`, error);
    // Re-throw error to be caught by the component, including validation errors if present
    if (error.validationErrors) {
      throw error;
    }
    throw new Error(
      error.message || "An unexpected error occurred during post update."
    );
  }
};

/**
 * Deletes a post by its ID.
 * API endpoint: DELETE /api/posts/{postId}
 * @param {number|string} postId - The ID of the post to delete.
 */
export const deletePost = async (postId) => {
  try {
    const response = await apiRequest(`/posts/${postId}`, "DELETE");
    if (response.ok) {
      // This will be true for a 204 status from the updated apiRequest
      return true;
    } else {
      const errorData = response.data;
      throw new Error(
        errorData?.message ||
          `Failed to delete post (status: ${response.status})`
      );
    }
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    throw error;
  }
};
// Add other post-related API functions here as needed (create, update, delete)
// For example:
// export const createPost = async (postData) => { ... }
