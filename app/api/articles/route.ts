import {
  asRecord,
  bool,
  forwardBackendResponse,
  requestError,
  text,
} from "../../lib/backend-api";
import {
  BACKEND_API_V1_URL,
  getBackendAuthHeaders,
  unauthorizedResponse,
} from "../../lib/backend-auth";

function toArticle(item: Record<string, unknown>) {
  const body = text(item.body);
  return {
    ...item,
    id: String(item.id ?? ""),
    summary: body.slice(0, 180),
    content: body,
    coverImage: text(item.cover_image),
    status: bool(item.is_published) ? "Published" : "Draft",
  };
}

function articlePayload(body: Record<string, unknown>) {
  const status = text(body.status);
  return {
    title: text(body.title),
    body: text(body.body, text(body.content)),
    cover_image: text(body.cover_image, text(body.coverImage)),
    author: text(body.author, "CBM Radio"),
    is_published: status ? status === "Published" : bool(body.is_published),
    is_featured: bool(body.is_featured),
    published_at:
      status === "Published" || bool(body.is_published)
        ? text(body.published_at, new Date().toISOString())
        : null,
  };
}

export async function GET() {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  try {
    return forwardBackendResponse(
      await fetch(`${BACKEND_API_V1_URL}/articles/`, { headers, cache: "no-store" }),
      toArticle,
    );
  } catch {
    return requestError("Unable to reach the articles service.", 502);
  }
}

export async function POST(request: Request) {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();
  const body = asRecord(await request.json().catch(() => null));
  if (!text(body.title) || !text(body.body, text(body.content))) {
    return requestError("Article title and content are required.");
  }
  try {
    return forwardBackendResponse(
      await fetch(`${BACKEND_API_V1_URL}/articles/`, {
        method: "POST",
        headers,
        body: JSON.stringify(articlePayload(body)),
      }),
      toArticle,
    );
  } catch {
    return requestError("Unable to reach the articles service.", 502);
  }
}

export async function PUT(request: Request) {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();
  const body = asRecord(await request.json().catch(() => null));
  const slug = text(body.slug);
  if (!slug) return requestError("Article slug is required for updates.");
  try {
    return forwardBackendResponse(
      await fetch(`${BACKEND_API_V1_URL}/articles/${encodeURIComponent(slug)}/`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(articlePayload(body)),
      }),
      toArticle,
    );
  } catch {
    return requestError("Unable to reach the articles service.", 502);
  }
}

export async function DELETE(request: Request) {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) return requestError("Article slug is required.");
  try {
    return forwardBackendResponse(
      await fetch(`${BACKEND_API_V1_URL}/articles/${encodeURIComponent(slug)}/`, {
        method: "DELETE",
        headers,
      }),
    );
  } catch {
    return requestError("Unable to reach the articles service.", 502);
  }
}
