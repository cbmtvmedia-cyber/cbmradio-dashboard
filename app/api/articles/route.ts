import { NextResponse } from 'next/server';

// 🔄 UPDATED: Points exactly to your master production variable saved in .env.local
const RAILWAY_API_URL = process.env.RAILWAY_API_URL || "https://railway.app";

// 1. GET ROUTE: Fetch articles list directly from Railway
export async function GET() {
  try {
    const response = await fetch(`${RAILWAY_API_URL}/articles/`, { 
      cache: "no-store" 
    });
    
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
  try {
    const incomingData = await request.json();

    const formattedPayload = {
      title: incomingData.title,
      summary: incomingData.summary,
      body: incomingData.body || incomingData.content || "", 
      cover_image: incomingData.cover_image || incomingData.coverImage || "https://unsplash.com", 
      status: incomingData.status || "Published",
    };

    const response = await fetch(`${RAILWAY_API_URL}/articles/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedPayload),
    });

    if (!response.ok) throw new Error("Failed to create article on backend");
    const finalSavedData = await response.json();
    
    return NextResponse.json(finalSavedData);
  } catch  {
    return NextResponse.json({ error: "Articles post endpoint offline" }, { status: 500 });
  }
}

// 3. PUT ROUTE: Receive edited updates from your frontend handleSave blocks
export async function PUT(request: Request) {
  try {
    const incomingData = await request.json();

    const formattedPayload = {
      title: incomingData.title,
      summary: incomingData.summary,
      body: incomingData.body || incomingData.content || "",
      cover_image: incomingData.cover_image || incomingData.coverImage || "https://unsplash.com",
      status: incomingData.status || "Published",
    };

    // Note: If your backend edits by slug or ID, append it here like `${RAILWAY_API_URL}/articles/${incomingData.id}/`
    const response = await fetch(`${RAILWAY_API_URL}/articles/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedPayload),
    });

    if (!response.ok) throw new Error("Failed to update article on backend");
    const finalSavedData = await response.json();
    
    return NextResponse.json(finalSavedData);
  } catch{
    return NextResponse.json({ error: "Articles update endpoint offline" }, { status: 500 });
  }
}
