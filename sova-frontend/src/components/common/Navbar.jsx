import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, apiRequest } from "../../utils/api"; //

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken()); //
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkAuthAndUser = async () => {
      const token = getToken(); //
      setIsLoggedIn(!!token);
      if (token) {
        try {
          const response = await apiRequest("/user", "GET"); //
          if (response.ok && response.data) {
            setCurrentUser(response.data);
          } else {
            // Token might be invalid, clear it
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            setCurrentUser(null);
          }
        } catch (error) {
          console.error("Failed to fetch user for navbar:", error);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };
    checkAuthAndUser();

    // Optional: Listen to storage changes to update login status across tabs
    const handleStorageChange = () => {
      checkAuthAndUser();
    };
    window.addEventListener("storage", handleStorageChange);
    // Listen for custom login/logout events
    window.addEventListener("authChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleStorageChange);
    };
  }, [navigate]); // Re-check on navigate to potentially reflect immediate login/logout

  const handleLogout = async () => {
    try {
      await apiRequest("/logout", "POST"); //
    } catch (error) {
      console.error("Logout API call failed:", error);
      // Proceed with frontend logout even if API call fails
    } finally {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setCurrentUser(null);
      window.dispatchEvent(new CustomEvent("authChange")); // Dispatch custom event
      navigate("/login");
    }
  };

  // Effect to update isLoggedIn when token changes (e.g. after login on another page)
  // This is an additional listener for robustness.
  useEffect(() => {
    const updateLoginStatus = () => {
      const currentToken = getToken(); //
      setIsLoggedIn(!!currentToken);
    };
    window.addEventListener("tokenChanged", updateLoginStatus); // Listen for a custom event
    return () => window.removeEventListener("tokenChanged", updateLoginStatus);
  }, []);

  return (
    <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-slate-300">
          Sova
        </Link>
        <div className="space-x-2 sm:space-x-4 flex items-center">
          <Link
            to="/blog"
            className="hover:text-slate-300 px-2 sm:px-3 py-2 rounded-md text-sm font-medium"
          >
            Blog
          </Link>

          {isLoggedIn && currentUser ? (
            <>
              {(currentUser.role === "admin" ||
                currentUser.role === "editor") && (
                <Link
                  to="/dashboard"
                  className="hover:text-slate-300 px-2 sm:px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
              {(currentUser.role === "admin" ||
                currentUser.role === "editor") && (
                <Link
                  to="/create-post"
                  className="hover:text-slate-300 px-2 sm:px-3 py-2 rounded-md text-sm font-medium hidden sm:inline-block"
                >
                  Create Post
                </Link>
              )}
              <span className="text-sm text-slate-400 hidden md:inline">
                Hi, {currentUser.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white hover:bg-gray-100 px-3 py-2 rounded-md text-black text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-slate-300 px-2 sm:px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
