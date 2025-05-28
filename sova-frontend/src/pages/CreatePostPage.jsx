import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/postService";
import useTitle from "../hooks/useTitle";
import { getToken } from "../utils/api"; // To check if user is logged in
// You might want to fetch the current user to check their role for authorization
// import { apiRequest } from '../utils/api';

export default function CreatePostPage() {
  useTitle("Create New Post - Sova");
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imagePath, setImagePath] = useState(""); // For simplicity, a text input for image URL
  const [publishedAt, setPublishedAt] = useState(""); // Format: YYYY-MM-DDTHH:mm

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({}); // For Laravel validation errors

  // Authorization check (basic: logged in, better: check role)
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login", { state: { from: "/create-post" } });
      return;
    }
    // More advanced: Fetch user and check role if only admins/editors can create
    // const fetchUserRole = async () => {
    //   const response = await apiRequest('/user', 'GET');
    //   if (response.ok && !['admin', 'editor'].includes(response.data.role)) {
    //     navigate('/dashboard', { replace: true }); // Or some other appropriate page
    //     alert("You don't have permission to create posts.");
    //   } else if (!response.ok) {
    //      navigate('/login', { state: { from: '/create-post' } });
    //   }
    // };
    // fetchUserRole();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setValidationErrors({});

    const postData = {
      title,
      body,
      image_path: imagePath || null, // Send null if empty
      published_at: publishedAt
        ? new Date(publishedAt).toISOString().slice(0, 19).replace("T", " ")
        : null, // Format for Laravel backend YYYY-MM-DD HH:MM:SS
    };

    try {
      const newPost = await createPost(postData);
      // Navigate to the new post's page or the blog home
      navigate(`/blog/${newPost.slug}`); // Assuming your createPost API returns the new post with a slug
    } catch (err) {
      if (err.validationErrors) {
        setValidationErrors(err.validationErrors);
        setError(err.message || "Please check the form for errors.");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
      console.error("Failed to create post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to display validation errors
  const displayValidationErrors = (field) => {
    if (validationErrors[field]) {
      return validationErrors[field].map((err, index) => (
        <p key={index} className="text-red-500 text-xs mt-1">
          {err}
        </p>
      ));
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            Create New Blog Post
          </h1>

          {error &&
            !Object.keys(validationErrors).length && ( // General error display
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
                rows="10"
                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your post content here... Markdown or HTML might be supported depending on your backend and display setup."
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
                type="text" // For simplicity, using text input. For file uploads, it's more complex.
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
                Publish Date & Time (Optional - leave blank to publish
                immediately or save as draft)
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

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
