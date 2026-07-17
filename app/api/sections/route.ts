// 📁 FILE PATH: app/api/sections/route.ts - BLOCK 1 OF 2
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 📁 Define the precise location where your disk database file saves on your laptop drive
const dataFilePath = path.join(process.cwd(), "service", "sectionsData.json");

// Helper method to safely read records from your laptop hard drive disk
const readDatabaseFile = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      // 🔒 Seed with your exact baseline array objects if the hard drive file is missing
      const baselineData = [
        { 
          id: "sec-homepage-hero", 
          pageName: "Homepage", 
          sectionName: "Hero Header Zone", 
          title: "The Rhythm of Your Day, Amplified.", 
          subtitle: "Independent Digital Web Radio", 
          description: "Streaming fresh alternative track mixes, local artist spotlights, and podcasts live 24/7.", 
          image: "https://unsplash.com", 
          backgroundImage: "https://unsplash.com", 
          video: "https://youtube.com" 
        }, 
        { 
          id: "sec-about-hero", 
          pageName: "About Page", 
          sectionName: "Microphone History Banner", 
          title: "Behind the Studio Microphone", 
          subtitle: "Our Broadcasting Legacy", 
          description: "Discover the collective team of engineers, curators, and independent broadcasters shaping audio culture.", 
          image: "https://unsplash.com", 
          backgroundImage: "https://unsplash.com", 
          video: "" 
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
// 📁 FIXED BLOCK 2 OF 2: app/api/sections/route.ts

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

export async function PUT(request: Request) {
  const currentDatabase = readDatabaseFile();
  const body = await request.json();
  const { id, title, subtitle, description, image, backgroundImage, video } = body;

  const updatedDatabase = currentDatabase.map((section: SectionSchema) => {
    if (section.id === id) {
      return { ...section, title, subtitle, description, image, backgroundImage, video };
    }
    return section;
  });

  // 🟢 THE FIX: Ensured the name strictly matches the helper 'writeDatabaseFile' defined in Block 1
  writeDatabaseFile(updatedDatabase);

  const updatedSection = updatedDatabase.find((s: SectionSchema) => s.id === id);
  return NextResponse.json(updatedSection);
}
