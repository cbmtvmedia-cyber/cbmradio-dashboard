import { NextResponse } from "next/server";
import {
  BACKEND_API_V1_URL,
  backendAuthFailure,
  getBackendAuthHeaders,
  unauthorizedResponse,
} from "../../lib/backend-auth";

export async function GET() {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();

  try {
    const response = await fetch(`${BACKEND_API_V1_URL}/gallery/`, {
      headers,
      cache: "no-store",
    });
    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Backend gallery fetch failed");
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
    const payload = {
      caption: body.caption || body.title,
      image: body.image || body.url,
      category: body.category,
      youtube_link: body.youtube_link || body.youtubeLink || "",
    };
    const response = await fetch(`${BACKEND_API_V1_URL}/gallery/`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Failed to create gallery item");
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ error: "Gallery post endpoint offline" }, { status: 500 });
  }
}
