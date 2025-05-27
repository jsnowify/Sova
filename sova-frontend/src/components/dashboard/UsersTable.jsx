import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api"; // Path from components/dashboard to utils

// Simple Green Dot Icon component
const GreenDotIcon = () => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 inline-block ml-2 text-green-500 fill-current"
  >
    <circle cx="50" cy="50" r="45" />
  </svg>
);

export default function UsersTable({ loggedInUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiRequest("/users", "GET"); // New API endpoint
        if (response.ok && Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setError(
            response.data?.message ||
              "Failed to fetch users. You might not have admin privileges."
          );
        }
      } catch (err) {
        setError("An error occurred while fetching users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if the logged-in user is an admin
    if (loggedInUser && loggedInUser.role === "admin") {
      fetchAllUsers();
    } else if (loggedInUser) {
      setError("You do not have permission to view all users.");
      setLoading(false);
    } else {
      // This case should ideally not be hit if DashboardPage handles auth properly
      setError("User not authenticated.");
      setLoading(false);
    }
  }, [loggedInUser]);

  if (loading) {
    return <p className="text-slate-600">Loading users table...</p>;
  }

  if (error) {
    return <p className="text-red-600">Notice: {error}</p>;
  }

  if (users.length === 0) {
    return <p className="text-slate-600">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">
        Manage Users
      </h3>
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Role
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Joined
            </th>
            {/* Add more columns if needed, e.g., Actions */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                {user.name}
                {loggedInUser &&
                  loggedInUser.id === user.id &&
                  loggedInUser.role === "admin" && <GreenDotIcon />}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === "admin"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
