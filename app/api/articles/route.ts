import { NextResponse } from 'next/server';
import {
  BACKEND_API_V1_URL,
  backendAuthFailure,
  getBackendAuthHeaders,
  unauthorizedResponse,
} from "../../lib/backend-auth";

// 🔄 UPDATED: Points exactly to your master production variable saved in .env.local
// 1. GET ROUTE: Fetch articles list directly from Railway
export async function GET() {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();

  try {
    const response = await fetch(`${BACKEND_API_V1_URL}/articles/`, {
      headers,
      cache: "no-store" 
    });
    
    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Railway fetch failed");
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    // Clean fallback to keep UI perfectly safe if backend sync drops
    return NextResponse.json({
      results: [
        {
          id: "art-1",
          title: "Station Launches New Morning Grid Slot",
          summary: "CBM Radio upgrades its live broadcast studio blocks this summer season.",
          body: "Full text content regarding the morning schedule slot expansion...",
          status: "Published"
        }
      ]
    });
  }
}

// 2. POST ROUTE: Receive new articles from your frontend page form
export async function POST(request: Request) {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();

  try {
    const incomingData = await request.json();

    const formattedPayload = {
      title: incomingData.title,
      summary: incomingData.summary,
      body: incomingData.body || incomingData.content || "", 
      cover_image: incomingData.cover_image || incomingData.coverImage || "https://unsplash.com", 
      status: incomingData.status || "Published",
    };

    const response = await fetch(`${BACKEND_API_V1_URL}/articles/`, {
      method: "POST",
      headers,
      body: JSON.stringify(formattedPayload),
    });

    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Failed to create article on backend");
    const finalSavedData = await response.json();
    
    return NextResponse.json(finalSavedData);
  } catch  {
    return NextResponse.json({ error: "Articles post endpoint offline" }, { status: 500 });
  }
}

// 3. PUT ROUTE: Receive edited updates from your frontend handleSave blocks
export async function PUT(request: Request) {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();

  try {
    const incomingData = await request.json();

    const formattedPayload = {
      title: incomingData.title,
      summary: incomingData.summary,
      body: incomingData.body || incomingData.content || "",
      cover_image: incomingData.cover_image || incomingData.coverImage || "https://unsplash.com",
      status: incomingData.status || "Published",
    };

    const response = await fetch(`${BACKEND_API_V1_URL}/articles/${incomingData.id}/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(formattedPayload),
    });

    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Failed to update article on backend");
    const finalSavedData = await response.json();
    
    return NextResponse.json(finalSavedData);
  } catch{
    return NextResponse.json({ error: "Articles update endpoint offline" }, { status: 500 });
  }
}
