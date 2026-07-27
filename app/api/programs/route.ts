import { NextResponse } from 'next/server';

// 🔄 FIXED: Uses your master production environment variable from your .env.local file
const RAILWAY_API_URL = process.env.RAILWAY_API_URL || "https://railway.app";

// 1. GET ROUTE: Fetch active homepage zones directly from Railway
export async function GET() {
  try {
    // 🔄 FIXED: Stripped out the extra '/api' and added trailing slash to hit /sections/ directly
    const response = await fetch(`${RAILWAY_API_URL}/sections/`, { 
      cache: "no-store" 
    });
    
    if (!response.ok) throw new Error("Railway fetch failed");
    const data = await response.json();
    return NextResponse.json(data);
  } catch  {
    // Clean paginated fallback layout structure to keep frontend safe from drops
    return NextResponse.json({
      results: [
        { 
          section_key: "hero_zone", 
          title: "CBM Broadcast Control Center", 
          subtitle: "Live Airwaves Hub", 
          body: "Active static landing sections description logs." 
        }
      ]
    });
  }
}

// 2. PUT ROUTE: Receive text content updates from your page forms and push to Railway
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // 💡 FIELD ALIGNMENT: Unpack and translate incoming options to fulfill unique key schema needs
    const payload = {
      section_key: body.section_key || body.id || "hero_zone", // 🔄 Maps local string identifier fields safely to 'section_key'
      title: body.title,
      subtitle: body.subtitle || "",
      body: body.body || body.content || body.headingText || "", // 🔄 Translates multi-case layout descriptions to 'body'
      image: body.image || "",
      cta_label: body.cta_label || "",
      cta_url: body.cta_url || "",
      is_active: body.is_active ?? true
    };

    // 🔄 FIXED: Stripped out the extra '/api' and added trailing slash to hit /sections/ directly
    const response = await fetch(`${RAILWAY_API_URL}/sections/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to modify layout section configuration");
    const data = await response.json();
    return NextResponse.json(data);
  } catch  {
    return NextResponse.json({ error: "Sections update endpoint offline" }, { status: 500 });
  }
}
