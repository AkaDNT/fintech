import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefix = ["/dashboard", "/wallets", "/transfer", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!protectedPrefix.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const access = request.cookies.get("access_token")?.value;

  if (!access) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/wallets/:path*",
    "/transfer/:path*",
    "/admin/:path*",
  ],
};
