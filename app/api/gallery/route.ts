import { NextResponse } from 'next/server';
import {
  backendAuthFailure,
  getBackendAuthHeaders,
  unauthorizedResponse,
} from "../../lib/backend-auth";

const RAILWAY_API_URL = process.env.RAILWAY_API_URL || "https://railway.app";

export async function GET() {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();

  try {
    const response = await fetch(`${RAILWAY_API_URL}/sections/`, { headers, cache: "no-store" });
    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Railway fetch failed");
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ results: [] });
  }
}

export async function PUT(request: Request) {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();

  try {
    const body = await request.json();
    const payload = {
      section_key: body.section_key || body.id, // 🔄 Maps your local string tracker name to 'section_key'
      title: body.title,
      subtitle: body.subtitle || "",
      body: body.body || body.content || "", // 🔄 Maps your local layout text to 'body'
      image: body.image || "",
      cta_label: body.cta_label || "",
      cta_url: body.cta_url || "",
      is_active: body.is_active ?? true
    };

    const response = await fetch(`${RAILWAY_API_URL}/sections/`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Failed to update layout section");
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Sections update endpoint offline" }, { status: 500 });
  }
}
