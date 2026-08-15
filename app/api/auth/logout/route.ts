import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  
  // Explicitly clear the session cookie with maxAge 0
  cookieStore.set("session_token", "", {
    maxAge: 0,
    path: "/",
  });

  const redirectUrl = new URL("/login", request.url);
  return NextResponse.redirect(redirectUrl);
}
