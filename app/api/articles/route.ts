// ==========================================
// 📁 FILE 1: app/api/articles/route.ts
// ==========================================
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "service", "articlesData.json");

const readDatabaseFile = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      const baselineData = [
        { id: "art-1", title: "Station Launches New Morning Grid Slot", summary: "CBM Radio upgrades its live broadcast studio blocks this summer season.", content: "Full text content regarding the morning schedule slot expansion...", status: "Published", date: "2026-07-15", image: "https://unsplash.com" }
      ];
      fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
      fs.writeFileSync(dataFilePath, JSON.stringify(baselineData, null, 2), "utf-8");
      return baselineData;
    }
    return JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
  } catch { return []; }
};

const writeDatabaseFile = (data: unknown) => fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");

export async function GET() { return NextResponse.json(readDatabaseFile()); }

export async function POST(request: Request) {
  const currentDatabase = readDatabaseFile();
  const body = await request.json();
  const newRecord = { id: `art-${Date.now()}`, date: new Date().toISOString().split("T")[0], ...body };
  currentDatabase.unshift(newRecord);
  writeDatabaseFile(currentDatabase);
  return NextResponse.json(newRecord);
}