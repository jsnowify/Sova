const API_BASE = "https://1588-143-44-185-202.ngrok-free.app/api";

export function getToken() {
  return localStorage.getItem("token");
}

export async function apiRequest(path, method = "GET", body = null) {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${getToken()}`,
  };

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, options);

    if (res.status === 204) {
      return { data: null, ok: true, status: res.status };
    }

    const responseText = await res.text();

    if (!res.ok) {
      let errorData = {
        message: `Request failed with status ${
          res.status
        }. Raw: ${responseText.substring(0, 200)}`,
      };
      if (responseText) {
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          console.error(
            "API error response was not valid JSON. Raw response snippet:",
            responseText.substring(0, 200)
          );
        }
      }
      return { data: errorData, ok: false, status: res.status };
    }

    if (!responseText) {
      // Handles 200 OK with empty body if it ever occurs
      console.warn(
        `apiRequest: Received ${res.status} but responseText is empty for path ${path}.`
      );
      // If JSON was absolutely expected, this could be an error.
      // For now, treating as success with no data, but this might hide issues if backend errorneously sends empty 200.
      return { data: null, ok: true, status: res.status };
    }

    try {
      const data = JSON.parse(responseText);
      return { data, ok: true, status: res.status };
    } catch (e) {
      console.error(
        `apiRequest: Successfully fetched but failed to parse JSON for path ${path}. Status: ${res.status}.`,
        "Error:",
        e,
        "Raw response snippet:",
        responseText.substring(0, 500) // Log more of the response
      );
      return {
        data: {
          // This is where your error message on the page comes from
          message:
            "Received an invalid JSON response from the server despite a successful status.",
        },
        ok: false,
        status: res.status, // Though res.status was likely 200 OK here
      };
    }
  } catch (networkError) {
    console.error(
      `apiRequest: Network error or failed to fetch for path ${path}.`,
      networkError
    );
    return {
      data: {
        message: networkError.message || "Network error or server unreachable.",
      },
      ok: false,
      status: 0,
    };
  }
}
