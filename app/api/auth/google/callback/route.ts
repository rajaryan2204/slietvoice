import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signToken, hashPassword } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://slietvoice.in";
  const redirectUri = `${siteUrl}/api/auth/google/callback`;

  if (error || !code) {
    return NextResponse.redirect(new URL(`/login?error=${error || "Google login failed"}`, request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL("/login?error=Google OAuth client keys are not configured in Vercel environment variables.", request.url)
    );
  }

  try {
    // 1. Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      return NextResponse.redirect(
        new URL(`/login?error=${tokenData.error_description || "Failed to retrieve access token from Google"}`, request.url)
      );
    }

    // 2. Fetch user information from Google
    const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const googleUser = await userinfoResponse.json();

    if (!userinfoResponse.ok || !googleUser.email) {
      return NextResponse.redirect(new URL("/login?error=Failed to retrieve user info from Google", request.url));
    }

    const { email, name } = googleUser;

    // 3. Find or create user in database
    let user = await db.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      // Create user
      const dummyPasswordHash = await hashPassword(Math.random().toString(36).slice(-10));
      const defaultDept = await db.department.findFirst();
      const departmentId = defaultDept ? defaultDept.id : null;

      user = await db.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          passwordHash: dummyPasswordHash,
          role: "STUDENT",
          departmentId,
          profile: {
            create: {
              studentId: Math.floor(1000000 + Math.random() * 9000000).toString(),
              year: 1,
              departmentId: departmentId || "default-dept",
            },
          },
        },
        include: { profile: true },
      });
    }

    // 4. Sign local session token
    const localToken = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // 5. Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("session_token", localToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // 6. Redirect to appropriate dashboard
    const dashboardPath = user.role === "STUDENT" ? "/student/dashboard" : "/admin/dashboard";
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  } catch (err: unknown) {
    console.error("Google OAuth Error:", err);
    const errMsg = err instanceof Error ? err.message : "OAuth processing error";
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errMsg)}`, request.url));
  }
}
