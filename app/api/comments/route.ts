// 📁 FILE PATH: app/api/comments/route.ts
import { NextResponse } from "next/server";

const RAILWAY_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://railway.app";

interface CommentSchema {
  id: string;
  sender: string;
  text: string;
  targetType: string;
  targetTitle: string;
  timestamp: string;
}

export async function GET() {
  try {
    const response = await fetch(`${RAILWAY_API_URL}/api/comments`, { cache: "no-store" });
    if (!response.ok) throw new Error("Railway fetch failed");
    
    const data: CommentSchema[] = await response.json();
    return NextResponse.json(data);
  } catch {
    // 🟢 Your exact original baseline data maintained as a safe fallback
    return NextResponse.json([
      { 
        id: "com-1", 
        sender: "Listener John", 
        text: "Loving the alternative tracks mix on the morning block!", 
        targetType: "Episode", 
        targetTitle: "Live Studio Session Mix", 
        timestamp: "Historical Log" 
      }
    ]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = {
      timestamp: "Just Now",
      ...body
    };

    const response = await fetch(`${RAILWAY_API_URL}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    const newRecord: CommentSchema = await response.json();
    return NextResponse.json(newRecord);
  } catch {
    return NextResponse.json({ error: "Failed to write comment to backend" }, { status: 500 });
  }
}
