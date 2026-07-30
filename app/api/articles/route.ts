import { asRecord, bool, requestError, text } from "../../lib/backend-api";
import { preserveBackendResponse, requestIsMultipart } from "../../lib/media-proxy";
import { BACKEND_API_V1_URL, getBackendAuthHeaders, unauthorizedResponse } from "../../lib/backend-auth";

function toArticle(item: Record<string, unknown>) {
  const body = text(item.body);
  return {
    ...item, id: String(item.id ?? ""), summary: body.slice(0, 180), content: body,
    coverImage: text(item.cover_image),
    externalCoverImage: text(item.external_cover_image_url),
    status: bool(item.is_published) ? "Published" : "Draft",
  };
}
function jsonPayload(body: Record<string, unknown>) {
  const published = text(body.status) === "Published" || bool(body.is_published);
  return {
    title: text(body.title), body: text(body.body, text(body.content)),
    cover_image: text(body.cover_image, text(body.coverImage)),
    author: text(body.author, "CBM Radio"), is_published: published,
    is_featured: bool(body.is_featured),
    published_at: published ? text(body.published_at, new Date().toISOString()) : null,
  };
}
async function mutate(request: Request, method: "POST" | "PATCH") {
  const multipart = requestIsMultipart(request);
  const headers = await getBackendAuthHeaders(!multipart);
  if (!headers) return unauthorizedResponse();
  try {
    let slug = "";
    let body: BodyInit;
    if (multipart) {
      const form = await request.formData();
      slug = text(form.get("slug")); form.delete("slug"); body = form;
    } else {
      const incoming = asRecord(await request.json());
      slug = text(incoming.slug); body = JSON.stringify(jsonPayload(incoming));
    }
    if (method === "PATCH" && !slug) return requestError("Article slug is required.");
    return preserveBackendResponse(await fetch(
      `${BACKEND_API_V1_URL}/articles/${slug ? `${encodeURIComponent(slug)}/` : ""}`,
      { method, headers, body },
    ), toArticle);
  } catch { return requestError("Unable to reach the articles service.", 502); }
}
export async function GET() {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  try { return preserveBackendResponse(await fetch(`${BACKEND_API_V1_URL}/articles/`, { headers, cache: "no-store" }), toArticle); }
  catch { return requestError("Unable to reach the articles service.", 502); }
}
export async function POST(request: Request) { return mutate(request, "POST"); }
export async function PUT(request: Request) { return mutate(request, "PATCH"); }
export async function DELETE(request: Request) {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) return requestError("Article slug is required.");
  try { return preserveBackendResponse(await fetch(`${BACKEND_API_V1_URL}/articles/${encodeURIComponent(slug)}/`, { method: "DELETE", headers }), toArticle); }
  catch { return requestError("Unable to reach the articles service.", 502); }
}
