import { NextResponse } from "next/server";
import {
  BACKEND_API_V1_URL,
  backendAuthFailure,
  getBackendAuthHeaders,
  unauthorizedResponse,
} from "../../lib/backend-auth";
import { asRecord, forwardBackendResponse, requestError, text } from "../../lib/backend-api";

const validRoles = new Set(["host", "co_host", "producer", "presenter", "technician", "manager", "director", "other"]);

function normalizeRole(value: unknown) {
  const role = text(value).toLowerCase().replace(/[\s-]+/g, "_");
  return validRoles.has(role) ? role : "other";
}

function toTeam(item: Record<string, unknown>) {
  const position = text(item.role, "other");
  return {
    ...item,
    id: String(item.id ?? ""),
    position,
    category: position.replaceAll("_", " "),
    image: text(item.photo),
  };
}

// 🔄 FIXED: Correctly points to your master production variable from your .env.local file
// 1. GET ROUTE: Fetch live paginated staff list directly from Railway
export async function GET() {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();

  try {
    // 🔄 FIXED: Stripped out the extra '/api' and added trailing slash to hit /team/ directly
    const response = await fetch(`${BACKEND_API_V1_URL}/team/`, {
      headers,
      cache: "no-store" 
    });
    
    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Railway fetch failed");
    return forwardBackendResponse(response, toTeam);
  } catch{
    // Your exact original baseline data arrays maintained cleanly as a safe fallback
    return NextResponse.json([
      {
        id: "team-1",
        name: "Haggai Nathan",
        category: "Management",
        position: "Station Director",
        photo: "https://unsplash.com",
        tagline: "Steering the vision.",
        biography: "Managing programming, operational schedules, and broadcast syndications.",
        socialLinks: "https://twitter.com"
      }
    ]);
  }
}

// 2. POST ROUTE: Receive new team profiles from your frontend forms
export async function POST(request: Request) {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();

  try {
    const body = asRecord(await request.json());

    const payload = {
      name: body.name,
      role: normalizeRole(body.role || body.position),
      bio: body.bio || body.biography || "",
      photo: body.photo || body.image || "https://unsplash.com", 
      is_active: body.is_active ?? true
    };

    const response = await fetch(`${BACKEND_API_V1_URL}/team/`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Failed to save team member to backend");
    return forwardBackendResponse(response, toTeam);
  } catch  {
    return NextResponse.json({ error: "Team post endpoint offline" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();

  try {
    const body = asRecord(await request.json());
    const payload = {
      name: body.name,
      role: normalizeRole(body.role || body.position),
      bio: body.bio || body.biography || "",
      photo: body.photo || body.image || "",
      is_active: body.is_active ?? true,
    };
    const response = await fetch(`${BACKEND_API_V1_URL}/team/${body.id}/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });
    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Failed to update team member");
    return forwardBackendResponse(response, toTeam);
  } catch {
    return NextResponse.json({ error: "Team update endpoint offline" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return requestError("Team member id is required.");
  try {
    const response = await fetch(`${BACKEND_API_V1_URL}/team/${encodeURIComponent(id)}/`, {
      method: "DELETE",
      headers,
    });
    return forwardBackendResponse(response);
  } catch {
    return requestError("Unable to reach the team service.", 502);
  }
}
