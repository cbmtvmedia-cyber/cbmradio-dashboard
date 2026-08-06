import { asRecord, requestError, text } from "../../lib/backend-api";
import { preserveBackendResponse, requestIsMultipart } from "../../lib/media-proxy";
import { BACKEND_API_V1_URL, getBackendAuthHeaders, unauthorizedResponse } from "../../lib/backend-auth";

const roles = new Set(["host", "co_host", "producer", "presenter", "technician", "manager", "director", "other"]);
function role(value: unknown) {
  const normalized = text(value).toLowerCase().replace(/[\s-]+/g, "_");
  return roles.has(normalized) ? normalized : "other";
}
function toTeam(item: Record<string, unknown>) {
  const position = text(item.role, "other");
  return {
    ...item, id: String(item.id ?? ""), position,
    category: position.replaceAll("_", " "), image: text(item.photo),
    externalImage: text(item.external_photo_url),
  };
}
function jsonPayload(body: Record<string, unknown>) {
  return {
    name: text(body.name), role: role(body.role ?? body.position),
    bio: text(body.bio, text(body.biography)),
    photo: text(body.photo, text(body.image)),
    email: text(body.email), phone: text(body.phone),
    twitter: text(body.twitter), instagram: text(body.instagram),
    facebook: text(body.facebook), is_active: body.is_active !== false,
  };
}
async function mutate(request: Request, method: "POST" | "PATCH") {
  const multipart = requestIsMultipart(request);
  const headers = await getBackendAuthHeaders(!multipart);
  if (!headers) return unauthorizedResponse();
  try {
    let id = "";
    let body: BodyInit;
    if (multipart) {
      const form = await request.formData();
      id = text(form.get("id")); form.delete("id");
      form.set("role", role(form.get("role") ?? form.get("position")));
      if (method === "POST" && !form.has("is_active")) form.set("is_active", "true");
      form.delete("position"); body = form;
    } else {
      const incoming = asRecord(await request.json());
      id = text(incoming.id); body = JSON.stringify(jsonPayload(incoming));
    }
    if (method === "PATCH" && !id) return requestError("Team member id is required.");
    return preserveBackendResponse(await fetch(
      `${BACKEND_API_V1_URL}/team/${id ? `${encodeURIComponent(id)}/` : ""}`,
      { method, headers, body },
    ), toTeam);
  } catch { return requestError("Unable to reach the team service.", 502); }
}
export async function GET() {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  try { return preserveBackendResponse(await fetch(`${BACKEND_API_V1_URL}/team/`, { headers, cache: "no-store" }), toTeam); }
  catch { return requestError("Unable to reach the team service.", 502); }
}
export async function POST(request: Request) { return mutate(request, "POST"); }
export async function PUT(request: Request) { return mutate(request, "PATCH"); }
export async function DELETE(request: Request) {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return requestError("Team member id is required.");
  try { return preserveBackendResponse(await fetch(`${BACKEND_API_V1_URL}/team/${encodeURIComponent(id)}/`, { method: "DELETE", headers }), toTeam); }
  catch { return requestError("Unable to reach the team service.", 502); }
}
