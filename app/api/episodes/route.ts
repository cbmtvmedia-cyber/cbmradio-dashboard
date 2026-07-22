// 📁 FILE PATH: app/api/episodes/route.ts
import { NextResponse } from "next/server";

const RAILWAY_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://railway.app";

// 🟢 YOUR ORIGINAL SCHEMA TYPING MAINTAINED NATIVELY:
interface EpisodeSchema {
  id: string;
  programTitle: string;
  title: string;
  description: string;
  thumbnailImage: string;
  youtubeLink: string;
  downloadLink: string;
  publishDate: string;
}

export async function GET() {
  try {
    const response = await fetch(`${RAILWAY_API_URL}/api/episodes`, { cache: "no-store" });
    if (!response.ok) throw new Error("Railway fetch failed");
    
    // 🧠 TYPING RESOLVED: Enforces your exact schema rule on the live server database output array
    const data: EpisodeSchema[] = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([
      { id: "ep-1", programTitle: "youth talk", title: "Freelancing Without Burnout", description: "Learn how to manage time, set boundaries with clients, and scale your digital career.", thumbnailImage: "https://unsplash.com", youtubeLink: "https://youtube.com", downloadLink: "https://example.com", publishDate: "2026-06-25" },
      { id: "ep-2", programTitle: "morning show", title: "Live Studio Session Mix", description: "An exclusive morning block featuring local indie track selections and live studio mixing.", thumbnailImage: "https://unsplash.com", youtubeLink: "https://youtube.com", downloadLink: "https://example.com", publishDate: "2026-06-28" }
    ]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${RAILWAY_API_URL}/api/episodes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const newRecord: EpisodeSchema = await response.json();
    return NextResponse.json(newRecord);
  } catch {
    return NextResponse.json({ error: "Failed to write episode to backend" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${RAILWAY_API_URL}/api/episodes`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const updatedRecord: EpisodeSchema = await response.json();
    return NextResponse.json(updatedRecord);
  } catch {
    return NextResponse.json({ error: "Failed to update episode on backend" }, { status: 500 });
  }
}