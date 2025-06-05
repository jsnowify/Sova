import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
      <div className="text-center space-y-6 p-6">
        <h1 className="text-5xl font-bold text-gray-800">Sova</h1>
        <p className="text-lg text-gray-600">Know. Read. Post.</p>

        <div className="space-x-4 mt-6">
          {isLoggedIn ? (
            <button
              onClick={handleGoToDashboard}
              className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-700"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2  bg-black text-white rounded-full hover:bg-gray-700"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
