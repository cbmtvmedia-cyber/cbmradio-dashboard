import { forwardBackendResponse, requestError } from "../../../lib/backend-api";
import { BACKEND_API_V1_URL, getBackendAuthHeaders, unauthorizedResponse } from "../../../lib/backend-auth";

export async function GET() {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  try {
    return forwardBackendResponse(await fetch(
      `${BACKEND_API_V1_URL}/dashboard/overview/`,
      { headers, cache: "no-store" },
    ));
  } catch {
    return requestError("Unable to reach the dashboard overview service.", 502);
  }
}
