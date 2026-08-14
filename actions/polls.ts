"use server";

import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function votePollAction(optionId: string) {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDENT") {
    return { error: "Only logged-in students can vote in polls" };
  }

  try {
    // Find the option to get the pollId
    const option = await db.pollOption.findUnique({
      where: { id: optionId },
      include: { poll: { include: { options: true } } },
    });

    if (!option) {
      return { error: "Poll option not found" };
    }

    if (!option.poll.isActive) {
      return { error: "This poll is no longer active" };
    }

    // Check if user has already voted on ANY option in this poll
    const optionIds = option.poll.options.map((opt) => opt.id);
    const existingVote = await db.pollVote.findFirst({
      where: {
        studentId: user.id,
        optionId: { in: optionIds },
      },
    });

    if (existingVote) {
      return { error: "You have already voted in this poll" };
    }

    await db.pollVote.create({
      data: {
        optionId,
        studentId: user.id,
      },
    });

    revalidatePath("/student/dashboard");
    revalidatePath("/student/voice"); // If polls are embedded there
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to submit vote" };
  }
}

export async function createPollAction(question: string, options: string[]) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized access" };
  }

  if (!question.trim()) return { error: "Question cannot be empty" };
  const validOptions = options.filter((o) => o.trim().length > 0);
  if (validOptions.length < 2) return { error: "At least two options are required" };

  try {
    const poll = await db.poll.create({
      data: {
        question,
        createdById: user.id,
        isActive: true,
      },
    });

    for (const optText of validOptions) {
      await db.pollOption.create({
        data: {
          pollId: poll.id,
          text: optText,
        },
      });
    }

    revalidatePath("/admin/polls");
    revalidatePath("/student/dashboard");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create poll" };
  }
}

export async function togglePollStatusAction(pollId: string) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized access" };
  }

  try {
    const poll = await db.poll.findUnique({ where: { id: pollId } });
    if (!poll) return { error: "Poll not found" };

    await db.poll.update({
      where: { id: pollId },
      data: { isActive: !poll.isActive },
    });

    revalidatePath("/admin/polls");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to change poll status" };
  }
}
