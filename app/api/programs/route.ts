// 📁 FILE PATH: app/api/programs/route.ts
import { NextResponse } from "next/server";

const RAILWAY_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://railway.app";

interface ProgramSchema {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  presenter: string;
}

export async function GET() {
  try {
    const response = await fetch(`${RAILWAY_API_URL}/api/programs`, { cache: "no-store" });
    if (!response.ok) throw new Error("Railway fetch failed");
    
    const data: ProgramSchema[] = await response.json();
    return NextResponse.json(data);
  } catch {
    // 🟢 Your exact original baseline data arrays maintained as a safe fallback
    return NextResponse.json([
      { id: "prog-1", title: "morning show", description: "Wake-up block music, comedy slots, and local community updates.", coverImage: "https://unsplash.com", presenter: "Sarah Jenkins" },
      { id: "prog-2", title: "youth talk", description: "Discussions touching on culture, digital careers, and freelancing.", coverImage: "https://unsplash.com", presenter: "Sarah Jenkins" },
      { id: "prog-3", title: "worship hour", description: "Gospel rhythms, uplifting message blocks, and Sunday reflections.", coverImage: "https://unsplash.com", presenter: "Marcus Vance" }
    ]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${RAILWAY_API_URL}/api/programs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const newRecord: ProgramSchema = await response.json();
    return NextResponse.json(newRecord);
  } catch {
    return NextResponse.json({ error: "Failed to write program to backend" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${RAILWAY_API_URL}/api/programs`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const updatedRecord: ProgramSchema = await response.json();
    return NextResponse.json(updatedRecord);
  } catch {
    return NextResponse.json({ error: "Failed to update program on backend" }, { status: 500 });
  }
}
