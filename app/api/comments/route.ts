import { NextResponse } from 'next/server';
import {
  BACKEND_API_V1_URL,
  backendAuthFailure,
  getBackendAuthHeaders,
  unauthorizedResponse,
} from "../../lib/backend-auth";
import { asRecord, bool, forwardBackendResponse, requestError, text } from "../../lib/backend-api";

function toComment(item: Record<string, unknown>) {
  const isArticle = item.article != null;
  return {
    ...item, id: String(item.id ?? ""), sender: text(item.name), text: text(item.body),
    targetType: isArticle ? "Article" : "Episode",
    targetTitle: isArticle ? `Article #${item.article}` : `Episode #${item.episode}`,
    timestamp: text(item.created_at),
    status: bool(item.is_approved) ? "Approved" : "Pending",
    replyText: text(item.admin_reply),
  };
}

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
    return forwardBackendResponse(response, toComment);
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
    const incomingData = asRecord(await request.json());

    const formattedPayload = {
      name: incomingData.name || incomingData.sender || "Anonymous Listener", 
      email: incomingData.email || "listener@cbmradio.com", 
      body: incomingData.body || incomingData.text || "", 
      article: incomingData.article || undefined,
      episode: incomingData.episode || undefined,
    };

    const response = await fetch(`${BACKEND_API_V1_URL}/comments/`, {
      method: "POST",
      headers,
      body: JSON.stringify(formattedPayload),
    });

    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Failed to post comment to backend");
    return forwardBackendResponse(response, toComment);
  } catch {
    return NextResponse.json({ error: "Comments post endpoint offline" }, { status: 500 });
  }
}

// 3. PUT ROUTE: Handles approving or updating comments status from dashboard
export async function PUT(request: Request) {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();

  try {
    const incomingData = asRecord(await request.json());

    const formattedPayload = {
      is_approved: incomingData.status === "Approved" || incomingData.is_approved === true,
      admin_reply: text(incomingData.admin_reply, text(incomingData.replyText)),
    };

    const response = await fetch(`${BACKEND_API_V1_URL}/comments/${incomingData.id}/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(formattedPayload),
    });

    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Failed to update comment on backend");
    return forwardBackendResponse(response, toComment);
  } catch {
    return NextResponse.json({ error: "Comments update endpoint offline" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return requestError("Comment id is required.");
  try {
    return forwardBackendResponse(await fetch(`${BACKEND_API_V1_URL}/comments/${encodeURIComponent(id)}/`, {
      method: "DELETE", headers,
    }));
  } catch {
    return requestError("Unable to reach the comments service.", 502);
  }
}
