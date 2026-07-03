// 📁 EXT FILE LOCATION PATH: app/api/dashboard/route.ts
import { NextResponse } from "next/server";
// Stepping up to look out of your API layer into services mock arrays
import {
  initialPageSections,
  initialTeamMembers,
  initialPrograms,
  initialEpisodes,
} from "../service/mockdata";

export async function GET() {
  // Return unified JSON analytics mapping data back over your local port
  return NextResponse.json({
    totalPageSections: initialPageSections.length,
    totalTeamMembers: initialTeamMembers.length,
    totalPrograms: initialPrograms.length,
    totalEpisodes: initialEpisodes.length,
    team: initialTeamMembers,
    programs: initialPrograms,
    episodes: initialEpisodes,
  });
}
