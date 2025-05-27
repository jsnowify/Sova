import React, { useEffect, useState } from "react";
import { getAllPosts } from "../services/postService";
import PostCard from "../components/blog/PostCard";
import useTitle from "../hooks/useTitle"; // Assuming you have this hook

export default function BlogHomePage() {
  useTitle("Sova Blog"); // Set the page title
  const [postsData, setPostsData] = useState(null); // To store Laravel pagination data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async (page) => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllPosts(page);
        setPostsData(data);
      } catch (err) {
        setError(err.message || "Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && postsData && newPage <= postsData.last_page) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-xl text-slate-700">Loading blog posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-3">
          Oops! Something went wrong.
        </h2>
        <p className="text-slate-700 mb-6">{error}</p>
        {/* You could add a retry button here */}
      </div>
    );
  }

  if (!postsData || postsData.data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-xl text-slate-700">
          No blog posts found yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-slate-800">
            The Sova Blog
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Insights, news, and articles from the Sova team.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {postsData.data.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Pagination Controls */}
        {postsData.last_page > 1 && (
          <nav
            className="mt-12 flex justify-center items-center space-x-2"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(postsData.current_page - 1)}
              disabled={postsData.current_page === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {/* You can add page number links here if desired */}
            <span className="text-sm text-slate-700">
              Page {postsData.current_page} of {postsData.last_page}
            </span>
            <button
              onClick={() => handlePageChange(postsData.current_page + 1)}
              disabled={postsData.current_page === postsData.last_page}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
