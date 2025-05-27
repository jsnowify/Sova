import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorHandlePage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Error - Sova";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 p-4">
      <h1 className="text-5xl font-bold mb-4">Oops!</h1>
      <p className="text-lg text-gray-600 mb-6">
        Something went wrong or the page doesn’t exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Back Home
      </button>
    </div>
  );
}
