import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link and useNavigate

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor", // Default role
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(
        "https://2392-143-44-185-202.ngrok-free.app/api/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Registration successful! You can now log in.",
        });
        setForm({ name: "", email: "", password: "", role: "editor" }); // Reset form
        // Optionally, you could redirect to login after a delay:
        // setTimeout(() => navigate('/login'), 2000);
      } else {
        // Handle validation errors if your backend sends them in data.errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(" ");
          setMessage({
            type: "error",
            text: errorMessages || data.message || "Registration failed",
          });
        } else {
          setMessage({
            type: "error",
            text: data.message || "Registration failed",
          });
        }
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl space-y-6"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Know. Read. Post.
      </h2>{" "}
      {message.text && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}
      <div>
        <label className="block mb-1.5 text-sm font-medium text-gray-700">
          Name
        </label>{" "}
        <input
          name="name"
          className="w-full border border-gray-300 px-4 py-2.5 rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black transition-colors" // Consistent styling
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block mb-1.5 text-sm font-medium text-gray-700">
          Email
        </label>{" "}
        <input
          name="email"
          type="email"
          className="w-full border border-gray-300 px-4 py-2.5 rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black transition-colors" // Consistent styling
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block mb-1.5 text-sm font-medium text-gray-700">
          Password
        </label>{" "}
        {/* Consistent styling */}
        <input
          name="password"
          type="password"
          className="w-full border border-gray-300 px-4 py-2.5 rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black transition-colors" // Consistent styling
          placeholder="•••••••• (min. 6 characters)"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block mb-1.5 text-sm font-medium text-gray-700">
          Role
        </label>{" "}
        <select
          name="role"
          className="w-full border border-gray-300 px-4 py-2.5 rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black transition-colors bg-white" // Consistent styling
          value={form.role}
          onChange={handleChange}
        >
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-150 ease-in-out ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        }`}
      >
        {loading ? "Registering..." : "Register"}
      </button>
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}
