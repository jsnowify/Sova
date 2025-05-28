const API_BASE = "http://127.0.0.1:8000/api";

export function getToken() {
  return localStorage.getItem("token");
}

export async function apiRequest(path, method = "GET", body = null) {
  const headers = {
    Accept: "application/json", // Important: Tell the server we prefer JSON responses
    Authorization: `Bearer ${getToken()}`,
  };

  // Only set Content-Type if there's a body to send
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

    // Handle 204 No Content: successful request with no body to parse
    if (res.status === 204) {
      return { data: null, ok: true, status: res.status }; // No body to parse, signal success
    }

    // For other responses, try to get the body as text first.
    // A response body can only be consumed once.
    const responseText = await res.text();

    if (!res.ok) {
      // Attempt to parse the error response as JSON
      let errorData = { message: `Request failed with status ${res.status}.` };
      if (responseText) {
        // Only try to parse if there's actual text content
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          // If parsing fails, the error response wasn't valid JSON (e.g., an HTML error page)
          console.error(
            "API error response was not valid JSON. Raw response snippet:",
            responseText.substring(0, 200)
          ); // Log snippet
          errorData.message = `Server returned non-JSON error (status ${res.status}). Check console for raw response.`;
        }
      }
      return { data: errorData, ok: false, status: res.status };
    }

    // If res.ok and not 204, expect a JSON body
    // If responseText is empty but status is OK (e.g. 200 OK with genuinely empty body),
    // JSON.parse('') would fail. Handle this case.
    if (!responseText) {
      return { data: null, ok: true, status: res.status }; // Success with no actual data content
    }

    try {
      const data = JSON.parse(responseText); // Parse the text we already fetched
      return { data, ok: true, status: res.status };
    } catch (e) {
      console.error(
        "Successfully fetched but failed to parse JSON:",
        e,
        "Raw response:",
        responseText
      );
      return {
        data: {
          message:
            "Received an invalid JSON response from the server despite a successful status.",
        },
        ok: false, // Treat as not okay if JSON parsing fails for an expected JSON response
        status: res.status,
      };
    }
  } catch (networkError) {
    // Catch actual network errors (e.g., server down, DNS issues, CORS issues not caught by browser earlier)
    console.error("Network error or failed to fetch:", networkError);
    return {
      data: {
        message: networkError.message || "Network error or server unreachable.",
      },
      ok: false,
      status: 0, // Indicate a network-level failure
    };
  }
}
