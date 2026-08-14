"use server";

import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function markNotificationsAsReadAction() {
  const user = await getSessionUser();
  if (!user) return { error: "Not logged in" };

  try {
    await db.notification.updateMany({
      where: {
        userId: user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    revalidatePath("/student/dashboard");
    revalidatePath("/student/notifications");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to mark notifications as read" };
  }
}
