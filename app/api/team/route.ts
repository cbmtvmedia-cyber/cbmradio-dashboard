// 📁 FILE PATH: app/api/team/route.ts
import { NextResponse } from "next/server";

let teamDatabase = [
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
];

export async function GET() {
  return NextResponse.json(teamDatabase);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newMember = { id: `team-${Date.now()}`, ...body };
  teamDatabase.unshift(newMember);
  return NextResponse.json(newMember);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name, category, position, photo, tagline, biography, socialLinks } = body;
  
  teamDatabase = teamDatabase.map(member => {
    if (member.id === id) {
      return { ...member, name, category, position, photo, tagline, biography, socialLinks };
    }
    return member;
  });
  
  const updatedMember = teamDatabase.find(t => t.id === id);
  return NextResponse.json(updatedMember);
}
