import { NextResponse } from "next/server";
import { initialComments } from "../../service/mockdata";

export async function GET() {
  return NextResponse.json(initialComments || []);
}
