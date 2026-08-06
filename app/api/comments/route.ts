import { asRecord, bool, forwardBackendResponse, number, requestError, text } from "../../lib/backend-api";
import { BACKEND_API_V1_URL, getBackendAuthHeaders, unauthorizedResponse } from "../../lib/backend-auth";

function toComment(item: Record<string, unknown>) {
  return {
    id: number(item.id) ?? 0,
    name: text(item.name),
    body: text(item.body),
    is_approved: bool(item.is_approved),
    admin_reply: text(item.admin_reply),
    created_at: text(item.created_at),
    article: number(item.article) ?? null,
    episode: number(item.episode) ?? null,
  };
}

export async function GET(request: Request) {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  const incoming = new URL(request.url).searchParams;
  const approved = new URLSearchParams();
  for (const key of ["page", "search"] as const) {
    const value = incoming.get(key)?.trim();
    if (value) approved.set(key, value);
  }
  const query = approved.size ? `?${approved.toString()}` : "";
  try {
    return forwardBackendResponse(
      await fetch(`${BACKEND_API_V1_URL}/comments/${query}`, { headers, cache: "no-store" }),
      toComment,
    );
  } catch {
    return requestError("Unable to reach the comments service.", 502);
  }
}

export async function PATCH(request: Request) {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();
  try {
    const incoming = asRecord(await request.json());
    const id = number(incoming.id);
    if (!id) return requestError("Comment id is required.");
    const payload: Record<string, unknown> = {};
    if (typeof incoming.is_approved === "boolean") payload.is_approved = incoming.is_approved;
    if (typeof incoming.admin_reply === "string") payload.admin_reply = incoming.admin_reply;
    if (!Object.keys(payload).length) return requestError("A moderation change is required.");
    return forwardBackendResponse(await fetch(
      `${BACKEND_API_V1_URL}/comments/${encodeURIComponent(String(id))}/`,
      { method: "PATCH", headers, body: JSON.stringify(payload) },
    ), toComment);
  } catch {
    return requestError("Unable to reach the comments service.", 502);
  }
}

export async function DELETE(request: Request) {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return requestError("Comment id is required.");
  try {
    return forwardBackendResponse(await fetch(
      `${BACKEND_API_V1_URL}/comments/${encodeURIComponent(id)}/`,
      { method: "DELETE", headers },
    ));
  } catch {
    return requestError("Unable to reach the comments service.", 502);
  }
}
