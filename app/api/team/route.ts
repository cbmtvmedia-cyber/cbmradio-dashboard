// 📁 FILE PATH: app/api/team/route.ts
import { NextResponse } from "next/server";

const RAILWAY_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://railway.app";

interface TeamSchema {
  id: string;
  name: string;
  category: string;
  position: string;
  photo: string;
  tagline: string;
  biography: string;
  socialLinks: string;
}

export async function GET() {
  try {
    const response = await fetch(`${RAILWAY_API_URL}/api/team`, { cache: "no-store" });
    if (!response.ok) throw new Error("Railway fetch failed");
    
    const data: TeamSchema[] = await response.json();
    return NextResponse.json(data);
  } catch {
    // 🟢 Your exact original baseline data arrays maintained as a safe fallback
    return NextResponse.json([
      { 
        id: "team-1", 
        name: "Marcus Vance", 
        category: "Leadership", 
        position: "Station Director", 
        photo: "https://unsplash.com", 
        tagline: "Driving independent audio culture forward.", 
        biography: "Marcus has over 15 years of broadcasting experience and manages daily station operations.", 
        socialLinks: "https://linkedin.com" 
      }, 
      { 
        id: "team-2", 
        name: "Sarah Jenkins", 
        category: "Presenters", 
        position: "Morning Show Host", 
        photo: "https://unsplash.com", 
        tagline: "Your morning coffee in audio form.", 
        biography: "Sarah hosts the morning show, mixing alternative tracks with community spotlights.", 
        socialLinks: "https://instagram.com" 
      }
    ]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${RAILWAY_API_URL}/api/team`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const newRecord: TeamSchema = await response.json();
    return NextResponse.json(newRecord);
  } catch {
    return NextResponse.json({ error: "Failed to write team member to backend" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${RAILWAY_API_URL}/api/team`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const updatedRecord: TeamSchema = await response.json();
    return NextResponse.json(updatedRecord);
  } catch {
    return NextResponse.json({ error: "Failed to update team member on backend" }, { status: 500 });
  }
}
