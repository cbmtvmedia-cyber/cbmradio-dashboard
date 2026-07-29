import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "admin_jwt_token";

export function proxy(request: NextRequest) {
  const adminCookie = request.cookies.get(AUTH_COOKIE_NAME);

  if (!adminCookie && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
