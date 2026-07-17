// 📁 FILE 2: app/api/comments/route.ts
// ==========================================
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "service", "commentsData.json");

const readDatabaseFile = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      const baselineData = [
        { id: "com-1", sender: "Listener John", text: "Loving the alternative tracks mix on the morning block!", targetType: "Episode", targetTitle: "Live Studio Session Mix", timestamp: "Historical Log" }
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
  const newRecord = { id: `com-${Date.now()}`, timestamp: "Just Now", ...body };
  currentDatabase.unshift(newRecord);
  writeDatabaseFile(currentDatabase);
  return NextResponse.json(newRecord);
}