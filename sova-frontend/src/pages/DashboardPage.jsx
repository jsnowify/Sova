import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, getToken } from "../utils/api";
import useTitle from "../hooks/useTitle";
import UsersTable from "../components/dashboard/UsersTable"; // Import the UsersTable

export default function DashboardPage() {
  useTitle("Dashboard - Sova");
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // This is the logged-in user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ... (useEffect for fetchUserData and handleLogout remain the same as your provided code)
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

  const handleLogout = async () => {
    try {
      const response = await apiRequest("/logout", "POST");
      if (response.ok) {
        localStorage.removeItem("token");
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

  if (loading && !user) {
    // Show main loading only if user data isn't fetched yet
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

        <section>
          <h2 className="text-2xl font-semibold text-slate-700 mb-6">
            Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Widget 1: Users Table */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              {" "}
              {/* Make it span more columns if needed */}
              {/* Pass the loggedInUser to the UsersTable */}
              {user && <UsersTable loggedInUser={user} />}
            </div>

            {/* Widget 2 (Placeholder) */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Blog Post Management
              </h3>
              <p className="text-slate-600 text-sm">
                Create, edit, and manage blog posts.
              </p>
              <button className="mt-4 px-4 py-2 bg-green-500 text-white text-xs font-semibold rounded-md hover:bg-green-600 transition-colors">
                Manage Posts
              </button>
            </div>

            {/* Widget 3 (Placeholder) */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Site Settings
              </h3>
              <p className="text-slate-600 text-sm">
                Configure general site settings or preferences.
              </p>
              <button className="mt-4 px-4 py-2 bg-purple-500 text-white text-xs font-semibold rounded-md hover:bg-purple-600 transition-colors">
                Configure
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
