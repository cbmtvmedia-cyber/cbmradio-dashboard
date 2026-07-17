// 📁 DIAGNOSTIC FILE SYSTEM WORKSPACE: app/api/gallery/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Permanent JSON file path on your computer disk storage
const dataFilePath = path.join(process.cwd(), "service", "gallery_data.json");

const readDatabaseFile = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      const baselineData = [
        { 
          id: "gal-1", 
          caption: "Studio Mic Setup B", 
          url: "https://unsplash.com", 
          category: "Studio", 
          youtubeLink: "" 
        }
      ];
      fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
      fs.writeFileSync(dataFilePath, JSON.stringify(baselineData, null, 2), "utf-8");
      console.log("📁 SYSTEM NOTICE: Generated brand-new database json file at path location.");
      return baselineData;
    }
    const fileContent = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("❌ FILE ERROR: Critical failure reading your hard drive file data:", error);
    return [];
  }
};

const writeDatabaseFile = (data: unknown) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    console.log("💾 HARD DRIVE WRITE SUCCESSFUL: Your new image data parameters are officially written to disk!");
  } catch (error) {
    console.error("❌ DISK WRITE FAILURE: Node file system was blocked from saving your array node:", error);
  }
};

export async function GET() {
  const currentDatabase = readDatabaseFile();
  return NextResponse.json(currentDatabase);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📥 API ROUTE RECIEVED NEW DATA PAYLOAD:", body);

    const currentDatabase = readDatabaseFile();
    
    // Construct unique node entity using standard compliance mappings
    const newRecord = { 
      id: `gal-${Date.now()}`, 
      caption: body.caption || "Untitled Capture Asset",
      url: body.url || "https://unsplash.com",
      category: body.category || "Photos",
      youtubeLink: body.youtubeLink || ""
    };

    currentDatabase.unshift(newRecord);
    writeDatabaseFile(currentDatabase);

    return NextResponse.json(newRecord);
  } catch (error) {
    console.error("❌ CRITICAL POST HANDLER RUNTIME FAILURE:", error);
    return NextResponse.json({ error: "API Compilation block" }, { status: 500 });
  }
}
