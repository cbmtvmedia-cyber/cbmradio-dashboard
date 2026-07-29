import { asRecord, bool, forwardBackendResponse, number, requestError, text } from "../../lib/backend-api";
import { BACKEND_API_V1_URL, getBackendAuthHeaders, unauthorizedResponse } from "../../lib/backend-auth";

function toEpisode(item: Record<string, unknown>) {
  return {
    ...item, id: String(item.id ?? ""), programId: item.program_id,
    programTitle: text(item.program_title), thumbnailImage: text(item.cover_image),
    youtubeLink: text(item.youtube_link), publishDate: text(item.publish_date),
  };
}
function payload(body: Record<string, unknown>) {
  return {
    program_id: number(body.program_id ?? body.programId ?? body.program),
    title: text(body.title), description: text(body.description),
    cover_image: text(body.cover_image, text(body.thumbnailImage)),
    youtube_link: text(body.youtube_link, text(body.youtubeLink)),
    publish_date: text(body.publish_date, text(body.publishDate)) || null,
    is_featured: bool(body.is_featured), is_active: body.is_active !== false,
  };
}
async function mutate(request: Request, method: "POST" | "PATCH") {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();
  const body = asRecord(await request.json().catch(() => null));
  const data = payload(body);
  if (!data.program_id) return requestError("A valid program is required.");
  if (!data.title) return requestError("Episode title is required.");
  const id = method === "PATCH" ? String(body.id ?? "") : "";
  if (method === "PATCH" && !id) return requestError("Episode id is required.");
  try {
    return forwardBackendResponse(await fetch(`${BACKEND_API_V1_URL}/episodes/${id ? `${id}/` : ""}`, {
      method, headers, body: JSON.stringify(data),
    }), toEpisode);
  } catch { return requestError("Unable to reach the episodes service.", 502); }
}
export async function GET() {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  try { return forwardBackendResponse(await fetch(`${BACKEND_API_V1_URL}/episodes/`, { headers, cache: "no-store" }), toEpisode); }
  catch { return requestError("Unable to reach the episodes service.", 502); }
}
export async function POST(request: Request) { return mutate(request, "POST"); }
export async function PUT(request: Request) { return mutate(request, "PATCH"); }
export async function DELETE(request: Request) {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return requestError("Episode id is required.");
  try { return forwardBackendResponse(await fetch(`${BACKEND_API_V1_URL}/episodes/${encodeURIComponent(id)}/`, { method: "DELETE", headers })); }
  catch { return requestError("Unable to reach the episodes service.", 502); }
}
