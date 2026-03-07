import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

function isAuthRoute(pathname: string) {
  return (
    pathname === "/login" ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/reset-password")
  );
}

function isProtectedRoute(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/websites") ||
    pathname.startsWith("/support")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = Boolean(request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value);

  if (hasRefreshToken && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!hasRefreshToken && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
