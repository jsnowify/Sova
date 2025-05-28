import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { getPostBySlug, updatePost } from "../services/postService"; // Ensure updatePost is in your service
import useTitle from "../hooks/useTitle";
import { getToken, apiRequest } from "../utils/api"; // For fetching current user

export default function EditPostPage() {
  const { slug } = useParams(); // Get slug from URL to fetch the post
  const navigate = useNavigate();
  const location = useLocation();

  // State for the post being edited
  const [post, setPost] = useState(null);

  // Form field states
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [publishedAt, setPublishedAt] = useState(""); // Stored as YYYY-MM-DDTHH:mm for <input type="datetime-local">

  // Loading and error states
  const [initialLoading, setInitialLoading] = useState(true); // For fetching initial post data
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Current user for authorization
  const [currentUser, setCurrentUser] = useState(null);

  // Set page title dynamically
  useTitle(post ? `Edit: ${post.title} - Sova Blog` : "Loading Editor...");

  // 1. Fetch current authenticated user for authorization checks
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login", { state: { from: location.pathname } }); // Redirect to login if not authenticated
      return;
    }
    const fetchCurrentUser = async () => {
      try {
        const response = await apiRequest("/user", "GET");
        if (response.ok && response.data) {
          setCurrentUser(response.data);
        } else {
          console.error(
            "Failed to fetch current user for edit page:",
            response.data?.message
          );
          navigate("/login", { state: { from: location.pathname } }); // Redirect if user fetch fails
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
        navigate("/login", { state: { from: location.pathname } });
      }
    };
    fetchCurrentUser();
  }, [navigate, location.pathname]);

  // 2. Fetch the post data to be edited
  useEffect(() => {
    if (!slug) {
      setError("No post identifier provided.");
      setInitialLoading(false);
      return;
    }

    const fetchPostToEdit = async () => {
      try {
        setInitialLoading(true);
        setError(null);
        const data = await getPostBySlug(slug);
        setPost(data);
        setTitle(data.title);
        setBody(data.body);
        setImagePath(data.image_path || "");

        // Convert backend datetime (YYYY-MM-DD HH:MM:SS) to datetime-local input format (YYYY-MM-DDTHH:MM)
        if (data.published_at) {
          const date = new Date(data.published_at.replace(" ", "T")); // Ensure it's ISO parseable
          // Format for datetime-local input, adjusting for potential timezone issues if backend is UTC
          // This creates a string like "2023-05-28T14:30"
          const localDateTime = new Date(
            date.getTime() - date.getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, 16);
          setPublishedAt(localDateTime);
        } else {
          setPublishedAt("");
        }
      } catch (err) {
        setError(`Failed to load post for editing: ${err.message}`);
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchPostToEdit();
  }, [slug]);

  // 3. Authorization check: Only allow edit if current user is owner or admin
  useEffect(() => {
    if (post && currentUser) {
      // Ensure both post and currentUser are loaded
      const canEdit =
        currentUser.id === post.user_id || currentUser.role === "admin";
      if (!canEdit) {
        alert("You do not have permission to edit this post.");
        navigate(`/blog/${post.slug}`, { replace: true }); // Redirect to the post or blog page
      }
    }
  }, [post, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!post) {
      // Should not happen if initial load was successful
      setError("Cannot submit, post data is missing.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setValidationErrors({});

    const postDataToUpdate = {
      title,
      body,
      image_path: imagePath || null,
      // Convert datetime-local value (YYYY-MM-DDTHH:MM) to backend format (YYYY-MM-DD HH:MM:SS)
      published_at: publishedAt
        ? new Date(publishedAt).toISOString().slice(0, 19).replace("T", " ")
        : null,
    };

    try {
      const updatedPost = await updatePost(post.id, postDataToUpdate); // Use post.id for the PUT request
      navigate(`/blog/${updatedPost.slug}`); // Navigate to the updated post's page
    } catch (err) {
      if (err.validationErrors) {
        setValidationErrors(err.validationErrors);
        setError(err.message || "Please check the form for errors.");
      } else {
        setError(
          err.message || "An unexpected error occurred while updating the post."
        );
      }
      console.error("Failed to update post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to display validation errors
  const displayValidationErrors = (field) => {
    if (validationErrors && validationErrors[field]) {
      return validationErrors[field].map((errMsg, index) => (
        <p key={index} className="text-red-500 text-xs mt-1">
          {errMsg}
        </p>
      ));
    }
    return null;
  };

  if (initialLoading || (getToken() && !currentUser)) {
    // Wait if logged in but current user not yet fetched
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-xl text-slate-700">Loading editor...</p>
      </div>
    );
  }

  if (error && !post) {
    // If initial loading of post failed
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-6 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-3">Error</h2>
        <p className="text-slate-700 mb-6">{error}</p>
        <Link
          to="/blog"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  if (!post) {
    // Should ideally be caught by the above, but as a final fallback
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-xl text-slate-700">
          Post not found or you do not have permission to edit it.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">
            Edit Post
          </h1>
          <p className="text-center text-slate-600 mb-8 text-lg">
            {post.title}
          </p>

          {error &&
            !Object.keys(validationErrors).length && ( // General error during submission
              <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
                {error}
              </div>
            )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {displayValidationErrors("title")}
            </div>

            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Body
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows="12"
                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your post content here..."
                required
              ></textarea>
              {displayValidationErrors("body")}
            </div>

            <div>
              <label
                htmlFor="imagePath"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Image URL (Optional)
              </label>
              <input
                type="text"
                id="imagePath"
                value={imagePath}
                onChange={(e) => setImagePath(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {displayValidationErrors("image_path")}
            </div>

            <div>
              <label
                htmlFor="publishedAt"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Publish Date & Time (Optional - leave blank to unpublish or save
                as draft)
              </label>
              <input
                type="datetime-local"
                id="publishedAt"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {displayValidationErrors("published_at")}
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <Link
                to={post ? `/blog/${post.slug}` : "/blog"}
                className="flex-1 text-center px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-md shadow-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
