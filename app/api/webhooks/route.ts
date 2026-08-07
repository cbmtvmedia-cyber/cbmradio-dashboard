import { NextResponse } from "next/server";

// No current CBM Radio workflow calls this route. Keep the former path closed
// instead of accepting and logging unauthenticated user-controlled events.
export function POST() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
