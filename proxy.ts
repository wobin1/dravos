import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

const protectedRoutes = ["/dashboard", "/admin"];
const adminOnlyRoutes = ["/admin"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAdminOnlyRoute = adminOnlyRoutes.some((route) => path.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get("session")?.value;
  const session = cookie ? await decrypt(cookie) : null;

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdminOnlyRoute && session.role !== "ADMIN") {
    // If trying to access admin route but not an ADMIN, redirect to employee dashboard
    return NextResponse.redirect(new URL("/dashboard/employee", request.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
