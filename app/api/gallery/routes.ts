import { NextResponse } from "next/server";
import { initialGallery } from "../../service/mockdata";

export async function GET() {
  return NextResponse.json(initialGallery);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newRecord = { id: `gal-${Date.now()}`, ...body };
  initialGallery.unshift(newRecord);
  return NextResponse.json(newRecord);
}
