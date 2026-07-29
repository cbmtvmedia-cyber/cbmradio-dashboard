import { NextResponse } from "next/server";
import {
  BACKEND_API_V1_URL,
  backendAuthFailure,
  getBackendAuthHeaders,
  unauthorizedResponse,
} from "../lib/backend-auth";

type PaginatedResponse = {
  count?: number;
  results?: unknown[];
};

export async function GET() {
  const headers = await getBackendAuthHeaders();
  if (!headers) return unauthorizedResponse();

  try {
    const paths = ["page-sections", "team", "programs", "episodes"] as const;
    const responses = await Promise.all(
      paths.map((path) =>
        fetch(`${BACKEND_API_V1_URL}/${path}/`, {
          headers,
          cache: "no-store",
        })
      )
    );

    for (const response of responses) {
      const authFailure = await backendAuthFailure(response);
      if (authFailure) return authFailure;
      if (!response.ok) throw new Error("Dashboard data fetch failed");
    }

    const [sections, team, programs, episodes] = (await Promise.all(
      responses.map((response) => response.json())
    )) as PaginatedResponse[];

    return NextResponse.json({
      totalPageSections: sections.count ?? sections.results?.length ?? 0,
      totalTeamMembers: team.count ?? team.results?.length ?? 0,
      totalPrograms: programs.count ?? programs.results?.length ?? 0,
      totalEpisodes: episodes.count ?? episodes.results?.length ?? 0,
      team: team.results ?? [],
      programs: programs.results ?? [],
      episodes: episodes.results ?? [],
    });
  } catch {
    return NextResponse.json({
      totalPageSections: 0,
      totalTeamMembers: 0,
      totalPrograms: 0,
      totalEpisodes: 0,
      team: [],
      programs: [],
      episodes: [],
    });
  }
}
