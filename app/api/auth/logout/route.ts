import { NextResponse } from "next/server";
import {
  AUTH_API_BASE_URL,
  AUTH_COOKIE_NAME,
  getBackendAuthHeaders,
} from "../../../lib/backend-auth";

export async function POST() {
  const headers = await getBackendAuthHeaders();
  let backendLoggedOut = false;

  if (headers) {
    try {
      const backendResponse = await fetch(`${AUTH_API_BASE_URL}/api/v1/auth/logout/`, {
        method: "POST",
        headers,
        cache: "no-store",
      });
      backendLoggedOut = backendResponse.ok;
    } catch {
      // The local session is still cleared if the backend is temporarily unavailable.
    }
  }

  const response = NextResponse.json({ logged_out: true, backend_logged_out: backendLoggedOut });
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}
