import { NextResponse } from 'next/server';
import {
  backendAuthFailure,
  getBackendAuthHeaders,
  unauthorizedResponse,
} from "../../lib/backend-auth";

// 🔄 FIXED: Points exactly to your master production variable saved in .env.local
const RAILWAY_API_URL = process.env.RAILWAY_API_URL || "https://railway.app";


// 1. GET ROUTE: Fetch active landing zones directly from Railway
export async function GET() {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();

  try {
    // 🔄 FIXED: Stripped out the extra '/api' and added trailing slash to hit /sections/ directly
    const response = await fetch(`${RAILWAY_API_URL}/sections/`, { 
      headers,
      cache: "no-store" 
    });
    
    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Railway fetch failed");
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    // Your exact original baseline data arrays maintained cleanly as a safe fallback
    return NextResponse.json([
      { id: "sec-homepage-hero", pageName: "Homepage", sectionName: "Hero Header Zone", title: "The Pulse of CBM" },
      { id: "sec-about-hero", pageName: "About Page", sectionName: "Microphone History Banner", title: "Our Legacy" }
    ]);
  }
}

// 2. PUT ROUTE: Map frontend updates and save them directly back to the server database
export async function PUT(request: Request) {
  const headers = await getBackendAuthHeaders(true);
  if (!headers) return unauthorizedResponse();

  try {
    const body = await request.json();

    // 💡 BODY KEY ALIGNMENT: Translate properties to match their required 'section_key' and 'body' layout columns
    const payload = {
      section_key: body.section_key || body.id || "hero_zone", // 🔄 Maps local string identifier fields safely to 'section_key'
      title: body.title,
      subtitle: body.subtitle || "",
      body: body.body || body.content || body.headingText || "", // 🔄 Translates variations to the backend's 'body' column
      image: body.image || "",
      cta_label: body.cta_label || "",
      cta_url: body.cta_url || "",
      is_active: body.is_active ?? true
    };

    // 🔄 FIXED: Stripped out the extra '/api' and added trailing slash to hit /sections/ directly
    const response = await fetch(`${RAILWAY_API_URL}/sections/`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    const authFailure = await backendAuthFailure(response);
    if (authFailure) return authFailure;
    if (!response.ok) throw new Error("Failed to modify layout section configuration");
    const updatedRecord = await response.json();
    return NextResponse.json(updatedRecord);
  } catch  {
    return NextResponse.json({ error: "Sections update endpoint offline" }, { status: 500 });
  }
}
