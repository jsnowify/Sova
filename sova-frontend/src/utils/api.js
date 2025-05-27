const API_BASE = "http://127.0.0.1:8000/api";

export function getToken() {
  return localStorage.getItem("token");
}

export async function apiRequest(path, method = "GET", body = null) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };

  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json();
  return { data, ok: res.ok };
}
