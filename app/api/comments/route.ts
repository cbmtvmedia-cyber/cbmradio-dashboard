import { NextResponse } from 'next/server';
import {
  BACKEND_API_V1_URL,
  backendAuthFailure,
  getBackendAuthHeaders,
  unauthorizedResponse,
} from "../../lib/backend-auth";

// 🔄 UPDATED: Points exactly to your master production variable saved in .env.local
// 1. GET ROUTE: Fetch live paginated comments directly from Railway
export async function GET() {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();

  try {
    const response = await fetch(`${BACKEND_API_V1_URL}/comments/`, {
      headers,
      cache: "no-store" 
    });
    
    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Railway fetch failed");
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    // Clean fallback matching your original baseline structure to prevent UI breaks
    return NextResponse.json({
      results: [
        {
          id: "com-1",
          sender: "Listener John",
          text: "Loving the alternative tracks mix on the morning block!",
          targetType: "Episode",
          targetTitle: "Live Studio Session Mix",
          timestamp: "Historical Log"
        }
      ]
    });
  }
}

// 2. POST ROUTE: Receive new listener comments from your form layout
export async function POST(request: Request) {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();

  try {
    const incomingData = await request.json();

    const formattedPayload = {
      name: incomingData.name || incomingData.sender || "Anonymous Listener", 
      email: incomingData.email || "listener@cbmradio.com", 
      body: incomingData.body || incomingData.text || "", 
      episode: Number(incomingData.episode) || 1, 
    };

    const response = await fetch(`${BACKEND_API_V1_URL}/comments/`, {
      method: "POST",
      headers,
      body: JSON.stringify(formattedPayload),
    });

    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Failed to post comment to backend");
    const finalSavedData = await response.json();
    
    return NextResponse.json(finalSavedData);
  } catch {
    return NextResponse.json({ error: "Comments post endpoint offline" }, { status: 500 });
  }
}

// 3. PUT ROUTE: Handles approving or updating comments status from dashboard
export async function PUT(request: Request) {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();

  try {
    const incomingData = await request.json();

    const formattedPayload = {
      name: incomingData.name || incomingData.sender,
      email: incomingData.email,
      body: incomingData.body || incomingData.text,
      episode: Number(incomingData.episode),
      status: incomingData.status // Useful if you have an approval/hidden toggle system
    };

    const response = await fetch(`${BACKEND_API_V1_URL}/comments/${incomingData.id}/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(formattedPayload),
    });

    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Failed to update comment on backend");
    const finalSavedData = await response.json();
    
    return NextResponse.json(finalSavedData);
  } catch {
    return NextResponse.json({ error: "Comments update endpoint offline" }, { status: 500 });
  }
}
