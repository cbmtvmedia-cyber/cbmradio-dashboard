import { asRecord, forwardBackendResponse, requestError, text } from "../../lib/backend-api";
import { BACKEND_API_V1_URL, getBackendAuthHeaders, unauthorizedResponse } from "../../lib/backend-auth";

function toSection(item: Record<string, unknown>) {
  const key = text(item.section_key);
  return {
    ...item, id: key, pageName: key, sectionName: key.replaceAll("_", " "),
    description: text(item.body), backgroundImage: "", video: "",
  };
}
export async function GET() {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  try {
    return forwardBackendResponse(await fetch(`${BACKEND_API_V1_URL}/page-sections/`, {
      headers, cache: "no-store",
    }), toSection);
  } catch { return requestError("Unable to reach the page sections service.", 502); }
}
export async function PUT(request: Request) {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();
  const body = asRecord(await request.json().catch(() => null));
  const key = text(body.section_key, text(body.id));
  if (!key) return requestError("Section key is required.");
  const payload = {
    title: text(body.title), subtitle: text(body.subtitle),
    body: text(body.body, text(body.description)),
    image: text(body.image), cta_label: text(body.cta_label),
    cta_url: text(body.cta_url), is_active: body.is_active !== false,
  };
  try {
    return forwardBackendResponse(await fetch(`${BACKEND_API_V1_URL}/page-sections/${encodeURIComponent(key)}/`, {
      method: "PATCH", headers, body: JSON.stringify(payload),
    }), toSection);
  } catch { return requestError("Unable to reach the page sections service.", 502); }
}
