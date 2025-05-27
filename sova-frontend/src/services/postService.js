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
// Add other post-related API functions here as needed (create, update, delete)
// For example:
// export const createPost = async (postData) => { ... }
