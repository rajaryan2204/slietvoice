import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-campus-voice-key-2026";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: { id: string; email: string; role: string; name: string }): Promise<string> {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function verifyToken(token: string): Promise<unknown> {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    if (!token) return null;

    const payload = (await verifyToken(token)) as { id?: string; email?: string; role?: string; name?: string } | null;
    if (!payload || !payload.id) return null;

    const user = await db.user.findUnique({
      where: { id: payload.id },
      include: {
        profile: true,
      },
    });
    return user;
  } catch {
    return null;
  }
}
