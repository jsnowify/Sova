import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllPosts, deletePost } from "../../services/postService"; // Adjust path if needed
// Assuming you have these icons or will create them (can be simple text too)
// You can reuse EditIcon and DeleteIcon from SinglePostPage if they are in a common file
// For now, let's define simple ones here or use text.

const ViewIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 inline-block"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path
      fillRule="evenodd"
      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
      clipRule="evenodd"
    />
  </svg>
);
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 inline-block"
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
    className="h-4 w-4 inline-block"
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

export default function DashboardPostsList() {
  const [postsData, setPostsData] = useState(null); // To store Laravel pagination data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const fetchPostsForDashboard = useCallback(async (page) => {
    try {
      setLoading(true);
      setError(null);
      // This uses the modified getAllPosts which gets all posts for admin/editor
      const data = await getAllPosts(page);
      setPostsData(data);
    } catch (err) {
      setError(err.message || "Failed to load posts for dashboard.");
      console.error("Dashboard posts fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPostsForDashboard(currentPage);
  }, [currentPage, fetchPostsForDashboard]);

  const handleDelete = async (postId, postTitle) => {
    if (
      window.confirm(
        `Are you sure you want to delete the post: "${postTitle}"?`
      )
    ) {
      try {
        await deletePost(postId);
        // Refetch posts for the current page to update the list
        fetchPostsForDashboard(currentPage);
        // Or, if the current page might become empty, navigate to page 1 or previous page
        // For simplicity, just refetching current page.
      } catch (err) {
        alert(`Failed to delete post: ${err.message}`);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && postsData && newPage <= postsData.last_page) {
      setCurrentPage(newPage);
    }
  };

  if (loading && !postsData) {
    // Show loading only on initial load
    return <p className="text-slate-600 p-4">Loading posts...</p>;
  }

  if (error) {
    return <p className="text-red-600 p-4">Error: {error}</p>;
  }

  if (!postsData || postsData.data.length === 0) {
    return (
      <div className="p-4">
        <p className="text-slate-600 mb-4">No posts found.</p>
        <Link
          to="/create-post"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
        >
          Create First Post
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-slate-800">
          Blog Posts ({postsData.total} total)
        </h3>
        <Link
          to="/create-post"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          Create New Post
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                Author
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {postsData.data.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                <td
                  className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 max-w-xs truncate"
                  title={post.title}
                >
                  {post.title}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                  {post.user?.name || "N/A"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {post.published_at &&
                  new Date(post.published_at) <= new Date() ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                  {new Date(post.updated_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link
                    to={`/blog/${post.slug}`}
                    title="View Post"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ViewIcon />
                  </Link>
                  <Link
                    to={`/edit-post/${post.slug}`}
                    title="Edit Post"
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <EditIcon />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    title="Delete Post"
                    className="text-red-600 hover:text-red-800"
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      {postsData.last_page > 1 && (
        <nav
          className="mt-6 flex justify-between items-center text-sm text-slate-700"
          aria-label="Pagination"
        >
          <div>
            Showing <span className="font-medium">{postsData.from}</span> to{" "}
            <span className="font-medium">{postsData.to}</span> of{" "}
            <span className="font-medium">{postsData.total}</span> results
          </div>
          <div className="space-x-1">
            <button
              onClick={() => handlePageChange(postsData.current_page - 1)}
              disabled={postsData.current_page === 1}
              className="relative inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(postsData.current_page + 1)}
              disabled={postsData.current_page === postsData.last_page}
              className="relative inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
