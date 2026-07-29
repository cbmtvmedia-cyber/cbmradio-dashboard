import { NextResponse } from 'next/server';

const RAILWAY_API_URL = process.env.RAILWAY_API_URL || "https://railway.app";

export async function GET() {
  try {
    const response = await fetch(`${RAILWAY_API_URL}/sections/`, { cache: "no-store" });
    if (!response.ok) throw new Error("Railway fetch failed");
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ results: [] });
  }
}

export async function PUT(request: Request) {
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to update layout section");
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Sections update endpoint offline" }, { status: 500 });
  }
}
