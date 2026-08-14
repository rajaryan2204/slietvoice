"use server";

import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const newsSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(15, "Content must be at least 15 characters"),
  category: z.string().min(1, "Category is required"),
});

export async function createNewsAction(prevState: any, formData: FormData) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized access" };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const imageUrl = formData.get("imageUrl") as string || null;

  const result = newsSchema.safeParse({ title, content, category });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    await db.news.create({
      data: {
        title,
        content,
        category,
        authorId: user.id,
        imageUrl,
        isVerified: true,
      },
    });

    revalidatePath("/student/news");
    revalidatePath("/student/dashboard");
    revalidatePath("/admin/news");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to publish news" };
  }
}

export async function deleteNewsAction(id: string) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized access" };
  }

  try {
    await db.news.delete({ where: { id } });
    revalidatePath("/student/news");
    revalidatePath("/admin/news");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete news" };
  }
}
