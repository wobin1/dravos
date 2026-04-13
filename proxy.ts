import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get("session")?.value;
  const session = cookie ? await decrypt(cookie) : null;

  // 1. Redirect root to dashboard (or login if no session)
  if (pathname === "/") {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Role-based protection check if needed (e.g. /dashboard/admin)
    if (pathname.startsWith("/dashboard/admin") && session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/employee", request.url));
    }

    return NextResponse.next();
  }

  // 3. Prevent logged-in users from accessing login page
  if (pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"],
};
