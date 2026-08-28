import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    let adminDept = await db.department.findUnique({
      where: { name: "Administration" },
    });

    if (!adminDept) {
      adminDept = await db.department.create({
        data: { name: "Administration" },
      });
    }

    const hashedPassword = await hashPassword("Aryan2204*");

    const user = await db.user.upsert({
      where: { email: "admin@college.edu" },
      update: {
        passwordHash: hashedPassword,
        role: "ADMIN",
      },
      create: {
        email: "admin@college.edu",
        name: "Dr. Aris Vance",
        passwordHash: hashedPassword,
        role: "ADMIN",
        departmentId: adminDept.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin credentials successfully initialized/updated.",
      email: user.email,
      role: user.role,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to initialize admin";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
