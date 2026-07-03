import { NextResponse } from "next/server";
import { initialArticles } from "../../service/mockdata";

export async function GET() {
  return NextResponse.json(initialArticles);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newRecord = { id: `art-${Date.now()}`, ...body };
  initialArticles.unshift(newRecord);
  return NextResponse.json(newRecord);
}
