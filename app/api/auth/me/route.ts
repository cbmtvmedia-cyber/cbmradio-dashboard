import { NextResponse } from "next/server";
import {
  AUTH_API_BASE_URL,
  AUTH_COOKIE_NAME,
  getApiError,
  getBackendAuthHeaders,
  isAdminUser,
  readJsonResponse,
  unauthorizedResponse,
} from "../../../lib/backend-auth";

export async function GET() {
  const headers = await getBackendAuthHeaders();

  if (!headers) {
    return unauthorizedResponse();
  }

  try {
    const backendResponse = await fetch(`${AUTH_API_BASE_URL}/api/v1/auth/me/`, {
      headers,
      cache: "no-store",
    });
    const data = await readJsonResponse(backendResponse);
    const user = data.user ?? data;

    if (!backendResponse.ok || !isAdminUser(user) || !user.is_staff) {
      const response = NextResponse.json(
        {
          error: getApiError(
            data,
            backendResponse.ok
              ? "Authentication server returned an invalid administrator."
              : "Your administrator session is no longer valid."
          ),
        },
        { status: backendResponse.ok ? 502 : backendResponse.status }
      );

      if (backendResponse.status === 401 || backendResponse.status === 403) {
        response.cookies.delete(AUTH_COOKIE_NAME);
      }

      return response;
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { error: "Network connection error to the authentication server." },
      { status: 502 }
    );
  }
}
