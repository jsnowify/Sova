import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation for redirect state
import { apiRequest } from "../../utils/api"; // Import your apiRequest function

export default function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();
  const location = useLocation(); // To get 'from' state for redirection

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Using your centralized apiRequest function
      // Ensure API_BASE in utils/api.js is correct!
      const response = await apiRequest("/login", "POST", form);

      if (response.ok && response.data && response.data.token) {
        setMessage({
          type: "success",
          text: "Login successful! Redirecting...",
        });
        localStorage.setItem("token", response.data.token);
        // Optionally store user data if your backend sends it and you need it immediately
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // Dispatch a custom event to notify other components (like Navbar) that auth state changed
        window.dispatchEvent(new CustomEvent("authChange"));

        // Redirect to the page the user was trying to access, or dashboard
        const from = location.state?.from?.pathname || "/dashboard";
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000); // 1-second delay to show message
      } else {
        // Handle errors from apiRequest or specific backend validation errors
        if (response.status === 422 && response.data && response.data.errors) {
          // Laravel validation errors
          const errorMessages = Object.values(response.data.errors)
            .flat()
            .join(" ");
          setMessage({
            type: "error",
            text:
              errorMessages || "Login failed. Please check your credentials.",
          });
        } else {
          // General error from apiRequest (like "Received an invalid JSON response...")
          // or other backend errors
          setMessage({
            type: "error",
            text: response.data?.message || "Login failed. Please try again.",
          });
        }
      }
    } catch (err) {
      // This catch block would typically handle network errors if apiRequest itself throws an error
      // before returning a structured response. Your current apiRequest tries to always return a structure.
      console.error("Login form submission error:", err);
      setMessage({
        type: "error",
        text: "Something went wrong during submission.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Login</h2>

      {message.text && (
        <div
          className={`p-2 rounded text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full border px-3 py-2 rounded"
          placeholder="email@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full border px-3 py-2 rounded"
          placeholder="********"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-gray-700"
        }`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
