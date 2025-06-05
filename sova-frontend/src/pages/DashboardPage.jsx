import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Make sure Link is imported
import { apiRequest, getToken } from "../utils/api"; // Ensure this path is correct
import useTitle from "../hooks/useTitle";
import UsersTable from "../components/dashboard/UsersTable";
import DashboardPostsList from "../components/dashboard/DashboardPostsList";

export default function DashboardPage() {
  useTitle("Dashboard - Sova");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // This state will hold the error message

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.log("DashboardPage: No token found, redirecting to login.");
      navigate("/login");
      return;
    }
    // console.log("DashboardPage: Token found:", token); // You can uncomment this for debugging

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors
        console.log("DashboardPage: Attempting to fetch /user data...");

        // This is the critical API call.
        // It uses the apiRequest function, which relies on API_BASE from utils/api.js
        const response = await apiRequest("/user", "GET");

        console.log(
          "DashboardPage: Response from apiRequest('/user'):",
          response
        );

        if (response.ok && response.data) {
          console.log(
            "DashboardPage: User data fetched successfully:",
            response.data
          );
          setUser(response.data);
        } else {
          // If response.ok is false OR response.data is null/undefined after a successful HTTP status,
          // this block will be hit.
          // The 'response.data?.message' will likely be "Received an invalid JSON response..."
          // if the parsing failed within apiRequest.
          const errorMessage =
            response.data?.message ||
            "Failed to fetch user data. Response not OK or no data.";
          console.error(
            "DashboardPage: Error fetching user data - ",
            errorMessage,
            "Full response:",
            response
          );
          setError(errorMessage);

          if (
            response.status === 401 ||
            (response.data?.message &&
              response.data.message.toLowerCase().includes("unauthenticated"))
          ) {
            console.log(
              "DashboardPage: Unauthenticated, removing token and redirecting to login."
            );
            localStorage.removeItem("token");
            // Potentially dispatch authChange event if Navbar needs to react
            window.dispatchEvent(new CustomEvent("authChange"));
            navigate("/login");
          }
        }
      } catch (err) {
        // This catch is for network errors or if apiRequest itself throws an unexpected error
        console.error("DashboardPage: Exception during fetchUserData:", err);
        setError("An unexpected error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Loading state: Show only if genuinely loading and no user yet and no error yet
  if (loading && !user && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-lg text-slate-700">
          Loading dashboard, please wait...
        </p>
      </div>
    );
  }

  // Error state: This is where your "Access Denied or Error" message is displayed
  if (error && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-6 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-3">
          Access Denied or Error
        </h2>
        {/* The 'error' variable here is set from the fetchUserData logic */}
        <p className="text-slate-700 mb-6">{error}</p>
        <button
          onClick={() => {
            localStorage.removeItem("token"); // Good practice to clear token
            window.dispatchEvent(new CustomEvent("authChange")); // Notify other components
            navigate("/login");
          }}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 ease-in-out"
        >
          Return to Login
        </button>
      </div>
    );
  }

  // If still loading but no user (and no error yet), or if !user for any other reason after loading
  if (!user) {
    console.log(
      "DashboardPage: Rendering, but user is null and no specific error message to show yet (or after loading)."
    );
    // This can be a brief state or indicate a problem if it persists.
    // You might want a more specific message or a redirect if user remains null after loading.
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-lg text-slate-700">Verifying user session...</p>
      </div>
    );
  }

  // Successfully loaded user data
  return (
    <div className="min-h-screen bg-slate-100">
      <main className="container mx-auto px-6 py-8">
        {/* This error is for issues that might occur *after* initial user load, if any */}
        {error && user && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-700 mb-6">
            User Management
          </h2>
          {user && <UsersTable loggedInUser={user} />}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-700 mb-6">
            Blog Management
          </h2>
          <DashboardPostsList />
        </section>

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
