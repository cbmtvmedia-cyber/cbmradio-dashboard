// 📁 FILE PATH: app/api/programs/route.ts
import { NextResponse } from "next/server";

// 🟢 THE FIX: Changed 'let' to 'const' to satisfy ESLint global module scope rules
const programsDatabase = [
  { 
    id: "prog-1", 
    title: "morning show", 
    description: "Wake-up block music, comedy slots, and local community updates.", 
    coverImage: "https://unsplash.com", 
    presenter: "Sarah Jenkins" 
  },
  { 
    id: "prog-2", 
    title: "youth talk", 
    description: "Discussions touching on culture, digital careers, and freelancing.", 
    coverImage: "https://unsplash.com", 
    presenter: "Sarah Jenkins" 
  },
  { 
    id: "prog-3", 
    title: "worship hour", 
    description: "Gospel rhythms, uplifting message blocks, and Sunday reflections.", 
    coverImage: "https://unsplash.com", 
    presenter: "Marcus Vance" 
  }
];

export async function GET() {
  return NextResponse.json(programsDatabase);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newProgram = { id: `prog-${Date.now()}`, ...body };
  programsDatabase.unshift(newProgram);
  return NextResponse.json(newProgram);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, title, description, coverImage, presenter } = body;

  // 🟢 THE FIX: Replaced direct variable re-assignment with an in-place mutation loop
  programsDatabase.forEach((prog, index) => {
    if (prog.id === id) {
      programsDatabase[index] = {
        ...prog,
        title,
        description,
        coverImage,
        presenter
      };
    }
  });

  const updatedProgram = programsDatabase.find(p => p.id === id);
  return NextResponse.json(updatedProgram);
}
