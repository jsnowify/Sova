import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useLocation } from "react-router-dom"; // Added useLocation
import { getPostBySlug, createComment } from "../services/postService";
import useTitle from "../hooks/useTitle"; // Your custom hook
import { getToken } from "../utils/api"; // To check if user is logged in

export default function SinglePostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Call useTitle directly. It will re-run when `post` changes.
  useTitle(post ? `${post.title} - Sova Blog` : "Loading Post...");

  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const isLoggedIn = !!getToken();
  const location = useLocation(); // For the login redirect state

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPostBySlug(slug);
      setPost(data);
      // The useTitle hook at the top of the component will automatically update the title
      // when the `post` state changes.
    } catch (err) {
      setError(err.message || `Failed to load post: ${slug}`);
      // useTitle will also update if `post` remains null and error is set
    } finally {
      setLoading(false);
    }
  }, [slug]); // `useTitle` itself is not a dependency here.

  useEffect(() => {
    if (slug) {
      fetchPost();
    } else {
      // If no slug, set a generic title or handle as an error
      // useTitle("Post Not Found - Sova Blog"); // Handled by the main useTitle call based on post state
      setError("Post slug not found in URL.");
      setLoading(false);
    }
  }, [slug, fetchPost]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;

    setIsSubmittingComment(true);
    setCommentError(null);
    try {
      const createdComment = await createComment(post.id, newComment);
      setPost((prevPost) => ({
        ...prevPost,
        comments: [createdComment, ...(prevPost.comments || [])],
      }));
      setNewComment("");
    } catch (err) {
      setCommentError(err.message || "Failed to submit comment.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-xl text-slate-700">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-3">
          Error Loading Post
        </h2>
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-xl text-slate-700">Post not found.</p>
      </div>
    );
  }

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not published";

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <article className="bg-white shadow-xl rounded-lg p-6 sm:p-8 lg:p-10">
          {post.image_path && (
            <img
              className="w-full h-auto max-h-96 object-cover rounded-lg mb-8"
              src={post.image_path} // Ensure this path is correct or construct if needed
              alt={post.title}
            />
          )}
          <header className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">
              {post.title}
            </h1>
            <div className="text-sm text-slate-500">
              <span>By {post.user?.name || "Unknown Author"}</span>
              <span className="mx-2">&bull;</span>
              <span>Published on {publishedDate}</span>
            </div>
          </header>
          <div
            className="prose prose-lg lg:prose-xl max-w-none text-slate-800" // Ensure @tailwindcss/typography is configured
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </article>

        {/* Comments Section */}
        <section className="mt-12 bg-white shadow-xl rounded-lg p-6 sm:p-8 lg:p-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 pb-4 border-b border-slate-200">
            Comments ({post.comments?.length || 0})
          </h2>
          {isLoggedIn ? (
            <form onSubmit={handleCommentSubmit} className="mb-10">
              <label
                htmlFor="commentBody"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Your Comment
              </label>
              <textarea
                id="commentBody"
                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows="4"
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={handleCommentChange}
                disabled={isSubmittingComment}
                required
              ></textarea>
              {commentError && (
                <p className="text-sm text-red-500 mt-1">{commentError}</p>
              )}
              <button
                type="submit"
                disabled={isSubmittingComment || !newComment.trim()}
                className="mt-4 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-60"
              >
                {isSubmittingComment ? "Submitting..." : "Post Comment"}
              </button>
            </form>
          ) : (
            <p className="text-slate-600 mb-10 text-center p-4 bg-slate-50 rounded-md">
              Please{" "}
              <Link
                to="/login"
                state={{ from: location.pathname }} // Pass current location for redirect after login
                className="text-blue-600 hover:underline font-semibold"
              >
                log in
              </Link>{" "}
              to post a comment.
            </p>
          )}

          {/* Comments List */}
          {post.comments && post.comments.length > 0 ? (
            <ul className="space-y-6">
              {post.comments.map((comment) => (
                <li
                  key={comment.id}
                  className="flex space-x-4 p-4 bg-slate-50 rounded-lg shadow"
                >
                  {/* Optional Avatar Placeholder
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-slate-500 font-semibold">
                    {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  */}
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-slate-800 text-sm">
                        {comment.user?.name || "Anonymous User"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(comment.created_at).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <p className="text-slate-700 text-sm whitespace-pre-wrap">
                      {comment.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            (!isLoggedIn || (isLoggedIn && post.comments?.length === 0)) && ( // Show "No comments yet" if logged in and no comments, or always if not logged in (and not showing login prompt)
              <p className="text-slate-600 text-center py-4">
                No comments yet. Be the first to share your thoughts!
              </p>
            )
          )}
        </section>

        <div className="mt-12 text-center">
          <Link
            to="/blog"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            &larr; Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
