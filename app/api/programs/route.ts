import { NextResponse } from "next/server";
import {
  BACKEND_API_V1_URL,
  backendAuthFailure,
  getBackendAuthHeaders,
  unauthorizedResponse,
} from "../../lib/backend-auth";
import { asRecord, bool, forwardBackendResponse, requestError, text } from "../../lib/backend-api";

function formatProgram(body: Record<string, unknown>) {
  return {
    title: body.title,
    description: body.description || "",
    cover_image: body.cover_image || body.coverImage || "",
    presenter: body.presenter,
    is_featured: bool(body.is_featured),
    is_active: body.is_active !== false,
  };
}

function toProgram(item: Record<string, unknown>) {
  return { ...item, id: String(item.id ?? ""), coverImage: text(item.cover_image) };
}

export async function GET() {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();

  try {
    const response = await fetch(`${BACKEND_API_V1_URL}/programs/`, {
      headers,
      cache: "no-store",
    });
    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Backend programs fetch failed");
    return forwardBackendResponse(response, toProgram);
  } catch {
    return NextResponse.json({ results: [] });
  }
}

export async function POST(request: Request) {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();

  try {
    const body = asRecord(await request.json());
    const response = await fetch(`${BACKEND_API_V1_URL}/programs/`, {
      method: "POST",
      headers,
      body: JSON.stringify(formatProgram(body)),
    });
    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Failed to create program");
    return forwardBackendResponse(response, toProgram);
  } catch {
    return NextResponse.json({ error: "Programs post endpoint offline" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();

  try {
    const body = asRecord(await request.json());
    const response = await fetch(`${BACKEND_API_V1_URL}/programs/${body.id}/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(formatProgram(body)),
    });
    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Failed to update program");
    return forwardBackendResponse(response, toProgram);
  } catch {
    return NextResponse.json({ error: "Programs update endpoint offline" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return requestError("Program id is required.");
  try {
    const response = await fetch(`${BACKEND_API_V1_URL}/programs/${encodeURIComponent(id)}/`, {
      method: "DELETE",
      headers,
    });
    return forwardBackendResponse(response);
  } catch {
    return requestError("Unable to reach the programs service.", 502);
  }
}
