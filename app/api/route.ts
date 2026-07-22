// 📁 FILE PATH: app/api/dashboard/route.ts
import { NextResponse } from "next/server";

const RAILWAY_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://railway.app";

export async function GET() {
  try {
    // 📡 Fetch the master aggregated dashboard stats directly from Railway
    const response = await fetch(`${RAILWAY_API_URL}/api/dashboard/stats`, { cache: "no-store" });
    if (!response.ok) throw new Error("Railway fetch failed");
    
    const liveData = await response.json();
    return NextResponse.json(liveData);
  } catch {
    // 🟢 Your exact original baseline parameter structure maintained as a safe fallback
    return NextResponse.json({
      totalPageSections: 2,
      totalTeamMembers: 2,
      totalPrograms: 3,
      totalEpisodes: 2,
      team: [
        { id: "team-1", name: "Marcus Vance", position: "Station Director", photo: "https://unsplash.com" },
        { id: "team-2", name: "Sarah Jenkins", position: "Morning Show Host", photo: "https://unsplash.com" }
      ],
      programs: [
        { id: "prog-1", title: "morning show", coverImage: "https://unsplash.com" },
        { id: "prog-2", title: "youth talk", coverImage: "https://unsplash.com" },
        { id: "prog-3", title: "worship hour", coverImage: "https://unsplash.com" }
      ],
      episodes: [
        { id: "ep-1", programTitle: "youth talk", title: "Freelancing Without Burnout", thumbnailImage: "https://unsplash.com" },
        { id: "ep-2", programTitle: "morning show", title: "Live Studio Session Mix", thumbnailImage: "https://unsplash.com" }
      ]
    });
  }
}
