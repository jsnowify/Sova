import React from "react";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  if (!post) {
    return null;
  }

  const excerpt = post.body
    ? post.body.substring(0, 150) + "..."
    : "No content available.";
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString()
    : "Not published";

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      {post.image_path && (
        <img
          className="w-full h-48 object-cover"
          src={post.image_path}
          alt={post.title}
        />
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 hover:text-gray-700 transition-colors">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="text-sm text-slate-500 mb-1">
          By {post.user?.name || "Unknown Author"}
        </p>
        <p className="text-xs text-slate-400 mb-3">
          Published: {publishedDate}
        </p>
        <p className="text-slate-700 text-sm mb-4">{excerpt}</p>
        <Link
          to={`/blog/${post.slug}`}
          className="inline-block px-5 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}
