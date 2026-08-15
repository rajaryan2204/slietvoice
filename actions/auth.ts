"use server";

import { db } from "@/lib/db";
import { verifyPassword, hashPassword, signToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { z } from "zod";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  studentId: z.string().regex(/^\d+$/, "Registration number must contain only numbers (e.g. 2614244)"),
  year: z.coerce.number().min(1).max(5),
  departmentId: z.string().min(1, "Department is required"),
});

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  let targetUrl = "";
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return { error: "Invalid email or password" };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { error: "Invalid email or password" };
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const cookieStore = await cookies();
    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    targetUrl = user.role === "STUDENT" ? "/student/dashboard" : "/admin/dashboard";
  } catch (error: any) {
    return { error: error.message || "Something went wrong" };
  }

  if (targetUrl) {
    redirect(targetUrl);
  }
}

export async function signupAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const studentId = formData.get("studentId") as string;
  const year = formData.get("year");
  const departmentId = formData.get("departmentId") as string;

  const result = signupSchema.safeParse({ name, email, password, studentId, year, departmentId });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  let shouldRedirect = false;
  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "Email already registered" };
    }

    const existingStudentId = await db.studentProfile.findUnique({ where: { studentId } });
    if (existingStudentId) {
      return { error: "Student ID already registered" };
    }

    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: "STUDENT",
        departmentId,
        profile: {
          create: {
            studentId,
            year: Number(year),
            departmentId,
          },
        },
      },
    });

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const cookieStore = await cookies();
    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    shouldRedirect = true;
  } catch (error: any) {
    return { error: error.message || "Failed to create student account" };
  }

  if (shouldRedirect) {
    redirect("/student/dashboard");
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
  redirect("/login");
}
