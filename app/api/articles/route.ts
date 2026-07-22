// 📁 FILE PATH: app/api/articles/route.ts
import { NextResponse } from "next/server";

const RAILWAY_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://railway.app";

interface ArticleSchema {
  id: string;
  title: string;
  summary: string;
  content: string;
  status: string;
  date: string;
  image: string;
}

export async function GET() {
  try {
    const response = await fetch(`${RAILWAY_API_URL}/api/articles`, { cache: "no-store" });
    if (!response.ok) throw new Error("Railway fetch failed");
    
    const data: ArticleSchema[] = await response.json();
    return NextResponse.json(data);
  } catch {
    // 🟢 Your exact original baseline data maintained as a safe fallback
    return NextResponse.json([
      { 
        id: "art-1", 
        title: "Station Launches New Morning Grid Slot", 
        summary: "CBM Radio upgrades its live broadcast studio blocks this summer season.", 
        content: "Full text content regarding the morning schedule slot expansion...", 
        status: "Published", 
        date: "2026-07-15", 
        image: "https://unsplash.com" 
      }
    ]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = {
      date: new Date().toISOString().split("T")[0],
      ...body
    };

    const response = await fetch(`${RAILWAY_API_URL}/api/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    const newRecord: ArticleSchema = await response.json();
    return NextResponse.json(newRecord);
  } catch {
    return NextResponse.json({ error: "Failed to write article to backend" }, { status: 500 });
  }
}
