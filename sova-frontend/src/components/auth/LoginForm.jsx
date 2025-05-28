import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Login successful! Redirecting...",
        });
        localStorage.setItem("token", data.token);

        console.log("Logged in user:", data);
        // Redirect to dashboard after a short delay to show the message
        setTimeout(() => {
          navigate("/dashboard"); // Redirect to /dashboard
        }, 1000); // 1-second delay
      } else {
        setMessage({ type: "error", text: data.message || "Login failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong." });
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
        <label className="block mb-1 font-medium">Email</label>
        <input
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
        <label className="block mb-1 font-medium">Password</label>
        <input
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
