// 📁 FILE PATH: app/api/dashboard/route.ts - BLOCK 1 OF 2
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 🧠 THE SYNC HELPER: Safely reads the local disk database files to pull down live up-to-date counts
const getLiveLengthOfFile = (fileName: string, fallbackLength: number): number => {
  try {
    const filePath = path.join(process.cwd(), "service", fileName);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const parsedData = JSON.parse(fileContent);
      return Array.isArray(parsedData) ? parsedData.length : fallbackLength;
    }
  } catch {
    return fallbackLength;
  }
  return fallbackLength;
};

// 🧠 THE SYNC DATA HELPER: Safely extracts entire array blocks from your laptop drive to feed the home analytics pipeline
const getLiveArrayOfFile = (fileName: string): unknown[] => {
  try {
    const filePath = path.join(process.cwd(), "service", fileName);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const parsedData = JSON.parse(fileContent);
      return Array.isArray(parsedData) ? parsedData : [];
    }
  } catch {
    return [];
  }
  return [];
};
// 📁 FILE PATH: app/api/dashboard/route.ts - BLOCK 2 OF 2
export async function GET() {
  // ⚡ DYNAMIC AGGREGATOR: Calculates total lengths from your active hard drive storage files!
  const liveSectionsLen = getLiveLengthOfFile("sectionsData.json", 2);
  const liveTeamLen = getLiveLengthOfFile("teamData.json", 2);
  const liveProgLen = getLiveLengthOfFile("programsData.json", 3);
  const liveEpLen = getLiveLengthOfFile("episodesData.json", 2);

  const liveTeamArray = getLiveArrayOfFile("teamData.json");
  const liveProgArray = getLiveArrayOfFile("programsData.json");
  const liveEpArray = getLiveArrayOfFile("episodesData.json");

  // 🟢 Return unified JSON analytics data matching your exact custom parameter layout contracts
  return NextResponse.json({
    totalPageSections: liveSectionsLen,
    totalTeamMembers: liveTeamLen,
    totalPrograms: liveProgLen,
    totalEpisodes: liveEpLen,
    team: liveTeamArray.length > 0 ? liveTeamArray : null,
    programs: liveProgArray.length > 0 ? liveProgArray : null,
    episodes: liveEpArray.length > 0 ? liveEpArray : null,
  });
}

