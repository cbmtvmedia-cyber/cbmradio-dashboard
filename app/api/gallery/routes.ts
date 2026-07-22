// 📁 FILE PATH: app/api/gallery/route.ts
import { NextResponse } from "next/server";

const RAILWAY_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://railway.app";

interface GallerySchema {
  id: string;
  caption: string;
  url: string;
  category: string;
  youtubeLink: string;
}

export async function GET() {
  try {
    const response = await fetch(`${RAILWAY_API_URL}/api/gallery`, { cache: "no-store" });
    if (!response.ok) throw new Error("Railway fetch failed");
    
    const data: GallerySchema[] = await response.json();
    return NextResponse.json(data);
  } catch {
    // 🟢 Your exact original baseline data maintained as a safe fallback
    return NextResponse.json([
      { 
        id: "gal-1", 
        caption: "Studio Mic Setup B", 
        url: "https://unsplash.com", 
        category: "Studio", 
        youtubeLink: "" 
      }
    ]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Construct dynamic node entity using your exact fallback parameter checks
    const payload = {
      caption: body.caption || "Untitled Capture Asset",
      url: body.url || "https://unsplash.com",
      category: body.category || "Photos",
      youtubeLink: body.youtubeLink || ""
    };

    const response = await fetch(`${RAILWAY_API_URL}/api/gallery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    const newRecord: GallerySchema = await response.json();
    return NextResponse.json(newRecord);
  } catch  {
    return NextResponse.json({ error: "Failed to write gallery asset to backend" }, { status: 500 });
  }
}
