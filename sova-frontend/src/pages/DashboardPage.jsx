import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Make sure Link is imported
import { apiRequest, getToken } from "../utils/api";
import useTitle from "../hooks/useTitle";
import UsersTable from "../components/dashboard/UsersTable";
import DashboardPostsList from "../components/dashboard/DashboardPostsList";

export default function DashboardPage() {
  useTitle("Dashboard - Sova");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ... (useEffect for fetchUserData remains the same as your provided code)
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/user", "GET");
        if (response.ok && response.data) {
          setUser(response.data);
        } else {
          setError(response.data?.message || "Failed to fetch user data.");
          if (
            response.status === 401 ||
            response.data?.message === "Unauthenticated."
          ) {
            localStorage.removeItem("token");
            navigate("/login");
          }
        }
      } catch (err) {
        setError("An error occurred while fetching user data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  // ... (handleLogout function remains the same as your provided code)
  const handleLogout = async () => {
    try {
      const response = await apiRequest("/logout", "POST");
      if (response.ok) {
        localStorage.removeItem("token");
        window.dispatchEvent(new CustomEvent("authChange"));
        navigate("/login");
      } else {
        console.error(
          "Logout failed:",
          response.data?.message || "Unknown error"
        );
        setError(response.data?.message || "Logout failed. Please try again.");
      }
    } catch (err) {
      console.error("Logout failed:", err);
      setError("An error occurred during logout. Please try again.");
    }
  };

  // ... (loading and error return statements remain the same)
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-lg text-slate-700">
          Loading dashboard, please wait...
        </p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-6 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-3">
          Access Denied or Error
        </h2>
        <p className="text-slate-700 mb-6">{error}</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 ease-in-out"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Assuming pageHeader is desired here, if not part of a broader layout that provides one */}

      <main className="container mx-auto px-6 py-8">
        {error && user && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Section for User Management */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-700 mb-6">
            User Management {/* <--- TITLE FOR USER MANAGEMENT */}
          </h2>
          {user && <UsersTable loggedInUser={user} />}
        </section>

        {/* Section for Blog Post Management */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-700 mb-6">
            Blog Management {/* <--- UPDATED TITLE FOR BLOG MANAGEMENT */}
          </h2>
          <DashboardPostsList />
        </section>

        {/* Section for Site Settings (still a placeholder) */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-700 mb-6">
            Settings
          </h2>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              Settings
            </h3>
            <p className="text-slate-600 text-sm">
              Settings or preferences (feature coming soon).
            </p>
            <button
              disabled
              className="mt-4 px-4 py-2 bg-purple-300 text-white text-xs font-semibold rounded-md cursor-not-allowed"
            >
              Configure
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
