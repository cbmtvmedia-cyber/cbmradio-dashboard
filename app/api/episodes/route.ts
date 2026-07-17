// 📁 FILE PATH: app/api/episodes/route.ts - BLOCK 1 OF 2
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 📁 Define the precise location where your disk database file saves on your laptop drive
const dataFilePath = path.join(process.cwd(), "service", "episodesData.json");

// Helper method to safely read records from your laptop hard drive disk
const readDatabaseFile = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      // 🔒 Seed with your exact baseline array objects if the hard drive file is missing
      const baselineData = [
        { 
          id: "ep-1", 
          programTitle: "youth talk", 
          title: "Freelancing Without Burnout", 
          description: "Learn how to manage time, set boundaries with clients, and scale your digital career.", 
          thumbnailImage: "https://unsplash.com", 
          youtubeLink: "https://youtube.com", 
          downloadLink: "https://example.com", 
          publishDate: "2026-06-25" 
        },
        { 
          id: "ep-2", 
          programTitle: "morning show", 
          title: "Live Studio Session Mix", 
          description: "An exclusive morning block featuring local indie track selections and live studio mixing.", 
          thumbnailImage: "https://unsplash.com", 
          youtubeLink: "https://youtube.com", 
          downloadLink: "https://example.com", 
          publishDate: "2026-06-28" 
        }
      ];
      fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
      fs.writeFileSync(dataFilePath, JSON.stringify(baselineData, null, 2), "utf-8");
      return baselineData;
    }
    const fileContent = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(fileContent);
  } catch {
    return [];
  }
};

// Helper method to write database updates down to your storage disk file
const writeDatabaseFile = (data: unknown) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
};

export async function GET() {
  const currentDatabase = readDatabaseFile();
  return NextResponse.json(currentDatabase);
}

export async function POST(request: Request) {
  const currentDatabase = readDatabaseFile();
  const body = await request.json();
  
  const newEpisode = { id: `ep-${Date.now()}`, ...body };
  currentDatabase.unshift(newEpisode);
  
  // ⚡ THE FIX: Permanently writes your added episode log entry to your laptop disk file!
  writeDatabaseFile(currentDatabase);
  
  return NextResponse.json(newEpisode);
}
// 📁 FILE PATH: app/api/episodes/route.ts - BLOCK 2 OF 2

// 🧠 Explicit TypeScript contract layout replaces the banned 'any' type definition
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

export async function PUT(request: Request) {
  const currentDatabase = readDatabaseFile();
  const body = await request.json();
  const { id, programTitle, title, description, thumbnailImage, youtubeLink, downloadLink, publishDate } = body;

  // 🟢 THE FIX: Replaced banned 'any' with explicit 'EpisodeSchema' type typing
  const updatedDatabase = currentDatabase.map((ep: EpisodeSchema) => {
    if (ep.id === id) {
      return { ...ep, programTitle, title, description, thumbnailImage, youtubeLink, downloadLink, publishDate };
    }
    return ep;
  });

  // Overwrites your local storage disk file with your edited data fields
  writeDatabaseFile(updatedDatabase);

  const updatedEpisode = updatedDatabase.find((e: EpisodeSchema) => e.id === id);
  return NextResponse.json(updatedEpisode);
}

