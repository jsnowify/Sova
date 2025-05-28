import { useState } from "react";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor",
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
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Registration successful!" });
        setForm({ name: "", email: "", password: "", role: "editor" });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Registration failed",
        });
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
      <h2 className="text-2xl font-bold text-center">Register</h2>

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
        <label className="block mb-1 font-medium">Name</label>
        <input
          name="name"
          className="w-full border px-3 py-2 rounded"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

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

      <div>
        <label className="block mb-1 font-medium">Role</label>
        <select
          name="role"
          className="w-full border px-3 py-2 rounded"
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
        className={`w-full py-2 px-4 rounded text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-gray-700"
        }`}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
