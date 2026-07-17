// 📁 FILE PATH: app/api/team/route.ts
import { NextResponse } from "next/server";

// 🟢 THE FIX: Changed 'let' to 'const' to satisfy ESLint module scope rules
const teamDatabase = [
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

  // 🟢 THE FIX: Replaced direct variable re-assignment with an in-place mutation loop
  teamDatabase.forEach((member, index) => {
    if (member.id === id) {
      teamDatabase[index] = {
        ...member,
        name,
        category,
        position,
        photo,
        tagline,
        biography,
        socialLinks
      };
    }
  });

  const updatedMember = teamDatabase.find(t => t.id === id);
  return NextResponse.json(updatedMember);
}
