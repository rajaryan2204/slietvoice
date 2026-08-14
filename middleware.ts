import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple base64 decoder to extract JWT details in edge runtime
function decodeJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session_token")?.value;
  const { pathname } = request.nextUrl;

  // Protect student paths
  if (pathname.startsWith("/student")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const user = decodeJwt(token);
    if (!user || user.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect admin paths
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const user = decodeJwt(token);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If logged in and trying to access auth pages, redirect to dashboard
  if (pathname === "/login" || pathname === "/signup") {
    if (token) {
      const user = decodeJwt(token);
      if (user) {
        if (user.role === "STUDENT") {
          return NextResponse.redirect(new URL("/student/dashboard", request.url));
        } else {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/admin/:path*", "/login", "/signup"],
};
