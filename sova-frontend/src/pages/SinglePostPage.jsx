import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  getPostBySlug,
  createComment,
  deletePost,
} from "../services/postService";
import useTitle from "../hooks/useTitle";
import { getToken, apiRequest } from "../utils/api";

// Simple SVG Icon Components (You can place these outside the component or in a separate file)
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1.5 inline-block"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path
      fillRule="evenodd"
      d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
      clipRule="evenodd"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1.5 inline-block"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

export default function SinglePostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useTitle(
    post
      ? `${post.title} - Sova Blog`
      : loading
      ? "Loading Post..."
      : "Post Not Found - Sova Blog"
  );

  const [currentUser, setCurrentUser] = useState(null);
  const [loadingCurrentUser, setLoadingCurrentUser] = useState(true);

  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const isLoggedIn = !!getToken();
  const location = useLocation();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (isLoggedIn) {
        try {
          setLoadingCurrentUser(true);
          const response = await apiRequest("/user", "GET");
          if (response.ok && response.data) {
            setCurrentUser(response.data);
          } else {
            console.error(
              "Failed to fetch current user:",
              response.data?.message
            );
          }
        } catch (err) {
          console.error("Error fetching current user:", err);
        } finally {
          setLoadingCurrentUser(false);
        }
      } else {
        setLoadingCurrentUser(false);
      }
    };
    fetchCurrentUser();
  }, [isLoggedIn]);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPostBySlug(slug);
      setPost(data);
    } catch (err) {
      setError(err.message || `Failed to load post: ${slug}`);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    } else {
      setError("Post slug not found in URL.");
      setLoading(false);
    }
  }, [slug, fetchPost]);

  const handleCommentChange = (e) => {
    /* ... (same as before) ... */ setNewComment(e.target.value);
  };
  const handleCommentSubmit = async (e) => {
    /* ... (same as before) ... */ e.preventDefault();
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

  const handleDeletePost = async () => {
    if (
      !post ||
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      await deletePost(post.id); // This calls the service, which uses the updated apiRequest
      alert("Post deleted successfully."); // This should now be reached without the JSON error
      navigate("/blog"); // Redirect to blog home page
    } catch (err) {
      alert(`Failed to delete post: ${err.message || "Please try again."}`);
      console.error("Delete post error:", err);
    }
  };

  const canManagePost =
    currentUser &&
    post &&
    (currentUser.id === post.user_id || currentUser.role === "admin");

  if (loading || (isLoggedIn && loadingCurrentUser)) {
    /* ... (same as before) ... */
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-xl text-slate-700">Loading post data...</p>
      </div>
    );
  }
  if (error) {
    /* ... (same as before) ... */
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
    /* ... (same as before) ... */
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
          {isLoggedIn && canManagePost && (
            <div className="mb-6 flex justify-end space-x-3 border-b border-slate-200 pb-4">
              <Link
                to={`/edit-post/${post.slug}`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 transition-colors"
              >
                <EditIcon /> Edit
              </Link>
              <button
                onClick={handleDeletePost}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
              >
                <DeleteIcon /> Delete
              </button>
            </div>
          )}

          {/* ... (rest of the article: image, header, body) ... */}
          {post.image_path && (
            <img
              className="w-full h-auto max-h-96 object-cover rounded-lg mb-8"
              src={post.image_path}
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
            className="prose prose-lg lg:prose-xl max-w-none text-slate-800"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </article>

        {/* Comments Section ... (same as before) ... */}
        <section className="mt-12 bg-white shadow-xl rounded-lg p-6 sm:p-8 lg:p-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 pb-4 border-b border-slate-200">
            Comments ({post.comments?.length || 0})
          </h2>
          {/* ... (comment form and list) ... */}
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
                state={{ from: location.pathname }}
                className="text-blue-600 hover:underline font-semibold"
              >
                log in
              </Link>{" "}
              to post a comment.
            </p>
          )}
          {post.comments && post.comments.length > 0 ? (
            <ul className="space-y-6">
              {post.comments.map((comment) => (
                <li
                  key={comment.id}
                  className="flex space-x-4 p-4 bg-slate-50 rounded-lg shadow"
                >
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
            (!isLoggedIn || (isLoggedIn && post.comments?.length === 0)) && (
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
