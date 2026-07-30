import { asRecord, requestError, text } from "../../lib/backend-api";
import { preserveBackendResponse, requestIsMultipart } from "../../lib/media-proxy";
import { BACKEND_API_V1_URL, getBackendAuthHeaders, unauthorizedResponse } from "../../lib/backend-auth";

function toSection(item: Record<string, unknown>) {
  const key = text(item.section_key);
  return {
    ...item, id: key, pageName: key, sectionName: key.replaceAll("_", " "),
    description: text(item.body), externalImage: text(item.external_image_url),
    backgroundImage: "", video: "",
  };
}
export async function GET() {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  try { return preserveBackendResponse(await fetch(`${BACKEND_API_V1_URL}/page-sections/`, { headers, cache: "no-store" }), toSection); }
  catch { return requestError("Unable to reach the page sections service.", 502); }
}
export async function PUT(request: Request) {
  const multipart = requestIsMultipart(request);
  const headers = await getBackendAuthHeaders(!multipart);
  if (!headers) return unauthorizedResponse();
  try {
    let key = "";
    let body: BodyInit;
    if (multipart) {
      const form = await request.formData();
      key = text(form.get("section_key"), text(form.get("id")));
      form.delete("id"); form.delete("section_key"); body = form;
    } else {
      const incoming = asRecord(await request.json());
      key = text(incoming.section_key, text(incoming.id));
      body = JSON.stringify({
        title: text(incoming.title), subtitle: text(incoming.subtitle),
        body: text(incoming.body, text(incoming.description)),
        image: text(incoming.image), cta_label: text(incoming.cta_label),
        cta_url: text(incoming.cta_url), is_active: incoming.is_active !== false,
      });
    }
    if (!key) return requestError("Section key is required.");
    return preserveBackendResponse(await fetch(
      `${BACKEND_API_V1_URL}/page-sections/${encodeURIComponent(key)}/`,
      { method: "PATCH", headers, body },
    ), toSection);
  } catch { return requestError("Unable to reach the page sections service.", 502); }
}
