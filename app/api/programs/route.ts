import { asRecord, bool, requestError, text } from "../../lib/backend-api";
import {
  preserveBackendResponse,
  requestIsMultipart,
} from "../../lib/media-proxy";
import {
  BACKEND_API_V1_URL,
  getBackendAuthHeaders,
  unauthorizedResponse,
} from "../../lib/backend-auth";

function toProgram(item: Record<string, unknown>) {
  return {
    ...item,
    id: String(item.id ?? ""),
    coverImage: text(item.cover_image),
    externalCoverImage: text(item.external_cover_image_url),
  };
}

function jsonPayload(body: Record<string, unknown>) {
  return {
    title: text(body.title),
    description: text(body.description),
    presenter: text(body.presenter),
    cover_image: text(body.cover_image, text(body.coverImage)),
    is_featured: bool(body.is_featured),
    is_active: body.is_active !== false,
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
      id = text(form.get("id"));
      form.delete("id");
      body = form;
    } else {
      const incoming = asRecord(await request.json());
      id = text(incoming.id);
      body = JSON.stringify(jsonPayload(incoming));
    }
    if (method === "PATCH" && !id) return requestError("Program id is required.");
    const response = await fetch(
      `${BACKEND_API_V1_URL}/programs/${id ? `${encodeURIComponent(id)}/` : ""}`,
      { method, headers, body },
    );
    return preserveBackendResponse(response, toProgram);
  } catch {
    return requestError("Unable to reach the programs service.", 502);
  }
}

export async function GET() {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  try {
    return preserveBackendResponse(
      await fetch(`${BACKEND_API_V1_URL}/programs/`, { headers, cache: "no-store" }),
      toProgram,
    );
  } catch {
    return requestError("Unable to reach the programs service.", 502);
  }
}
export async function POST(request: Request) { return mutate(request, "POST"); }
export async function PUT(request: Request) { return mutate(request, "PATCH"); }
export async function DELETE(request: Request) {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return requestError("Program id is required.");
  try {
    return preserveBackendResponse(
      await fetch(`${BACKEND_API_V1_URL}/programs/${encodeURIComponent(id)}/`, {
        method: "DELETE", headers,
      }),
      toProgram,
    );
  } catch {
    return requestError("Unable to reach the programs service.", 502);
  }
}
