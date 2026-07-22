// 📁 FILE PATH: app/api/sections/route.ts
import { NextResponse } from "next/server";

const RAILWAY_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://railway.app";

interface SectionSchema {
  id: string;
  pageName: string;
  sectionName: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  backgroundImage: string;
  video: string;
}

export async function GET() {
  try {
    const response = await fetch(`${RAILWAY_API_URL}/api/sections`, { cache: "no-store" });
    if (!response.ok) throw new Error("Railway fetch failed");
    
    const data: SectionSchema[] = await response.json();
    return NextResponse.json(data);
  } catch {
    // 🟢 Your exact original baseline data arrays maintained as a safe fallback
    return NextResponse.json([
      { id: "sec-homepage-hero", pageName: "Homepage", sectionName: "Hero Header Zone", title: "The Rhythm of Your Day, Amplified.", subtitle: "Independent Digital Web Radio", description: "Streaming fresh alternative track mixes, local artist spotlights, and podcasts live 24/7.", image: "https://unsplash.com", backgroundImage: "https://unsplash.com", video: "https://youtube.com" },
      { id: "sec-about-hero", pageName: "About Page", sectionName: "Microphone History Banner", title: "Behind the Studio Microphone", subtitle: "Our Broadcasting Legacy", description: "Discover the collective team of engineers, curators, and independent broadcasters shaping audio culture.", image: "https://unsplash.com", backgroundImage: "https://unsplash.com", video: "" }
    ]);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${RAILWAY_API_URL}/api/sections`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const updatedRecord: SectionSchema = await response.json();
    return NextResponse.json(updatedRecord);
  } catch {
    return NextResponse.json({ error: "Failed to update section on backend" }, { status: 500 });
  }
}
