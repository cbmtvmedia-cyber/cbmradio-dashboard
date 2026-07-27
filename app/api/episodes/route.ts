import { NextResponse } from 'next/server';

// 1. GET ROUTE: Fetch live paginated list from Railway
export async function GET() {
  try {
    // 🔄 UPDATED PATH: Hits /episodes/ directly based on documentation page 7
    const response = await fetch(`${process.env.RAILWAY_API_URL}/episodes/`, { 
      cache: "no-store" 
    });
    
    if (!response.ok) throw new Error("Railway fetch failed");
    const data = await response.json();
    return NextResponse.json(data);
  } catch  {
    // Fallback data loop stays perfectly intact
    return NextResponse.json([
      { id: "ep-1", programTitle: "youth talk", title: "Freelancing Without Burnout", description: "Learn how" },
      { id: "ep-2", programTitle: "morning show", title: "Live Studio Session Mix", description: "An exclusi" }
    ]);
  }
}

// 2. POST ROUTE: Receive from frontend page form and save permanently to Railway
export async function POST(request: Request) {
  try {
    const incomingData = await request.json();

    // 💡 BODY KEY ALIGNMENT: Unpack and translate fields to match their database layout rules
    const formattedPayload = {
      program: incomingData.program || 1, // Connects the episode to a parent program ID number
      title: incomingData.title,
      description: incomingData.description,
      cover_image: incomingData.cover_image || "https://unsplash.com",
      youtube_link: incomingData.youtube_link || "",
      download_link: incomingData.download_link || "",
      publish_date: incomingData.publish_date || "2026-07-03"
    };

    // 🔄 UPDATED PATH: Sends payload securely down their production endpoint
    const response = await fetch(`${process.env.RAILWAY_API_URL}/episodes/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedPayload),
    });

    if (!response.ok) throw new Error("Failed to create episode on backend");
    const finalSavedData = await response.json();
    
    return NextResponse.json(finalSavedData);
  } catch {
    return NextResponse.json({ error: "Authentication or saving endpoint offline" }, { status: 500 });
  }
}
