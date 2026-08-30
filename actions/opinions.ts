"use server";

import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const opinionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  isAnonymous: z.boolean(),
});

export async function createOpinionAction(prevState: any, formData: FormData) {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDENT") {
    return { error: "Unauthorized access" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const isAnonymous = formData.get("isAnonymous") === "true";

  const result = opinionSchema.safeParse({ title, description, category, isAnonymous });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    const opinion = await db.opinion.create({
      data: {
        title,
        description,
        category,
        isAnonymous,
        authorId: isAnonymous ? null : user.id,
      },
    });

    revalidatePath("/student/voice");
    return { success: true, opinionId: opinion.id };
  } catch (error: any) {
    return { error: error.message || "Failed to submit suggestion" };
  }
}

export async function supportOpinionAction(opinionId: string) {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDENT") {
    return { error: "Only students can support opinions" };
  }

  try {
    const existingSupport = await db.opinionSupport.findUnique({
      where: {
        opinionId_studentId: {
          opinionId,
          studentId: user.id,
        },
      },
    });

    if (existingSupport) {
      // Remove support (toggle off)
      await db.opinionSupport.delete({
        where: {
          id: existingSupport.id,
        },
      });
      revalidatePath("/student/voice");
      return { success: true, supported: false };
    } else {
      // Add support
      await db.opinionSupport.create({
        data: {
          opinionId,
          studentId: user.id,
        },
      });
      revalidatePath("/student/voice");
      return { success: true, supported: true };
    }
  } catch (error: any) {
    return { error: error.message || "Failed to update support status" };
  }
}

export async function deleteOpinionAction(opinionId: string) {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Unauthorized access" };
  }

  try {
    const opinion = await db.opinion.findUnique({
      where: { id: opinionId },
    });

    if (!opinion) {
      return { error: "Suggestion not found" };
    }

    if (opinion.authorId && opinion.authorId !== user.id && user.role !== "ADMIN" && user.role !== "MODERATOR") {
      return { error: "You can only delete your own suggestions" };
    }

    // Delete all supports and then the opinion
    await db.opinionSupport.deleteMany({ where: { opinionId } });
    await db.opinion.delete({ where: { id: opinionId } });

    revalidatePath("/student/voice");
    revalidatePath("/admin/voice");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete suggestion" };
  }
}

