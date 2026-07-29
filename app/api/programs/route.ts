import { NextResponse } from "next/server";
import {
  BACKEND_API_V1_URL,
  backendAuthFailure,
  getBackendAuthHeaders,
  unauthorizedResponse,
} from "../../lib/backend-auth";

function formatProgram(body: Record<string, unknown>) {
  return {
    title: body.title,
    description: body.description || "",
    cover_image: body.cover_image || body.coverImage || "",
    presenter: body.presenter,
  };
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
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ results: [] });
  }
}

export async function POST(request: Request) {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();

  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_API_V1_URL}/programs/`, {
      method: "POST",
      headers,
      body: JSON.stringify(formatProgram(body)),
    });
    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Failed to create program");
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ error: "Programs post endpoint offline" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();

  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_API_V1_URL}/programs/${body.id}/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(formatProgram(body)),
    });
    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Failed to update program");
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ error: "Programs update endpoint offline" }, { status: 500 });
  }
}
