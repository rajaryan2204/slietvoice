"use server";

import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const raiseComplaintSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(15, "Description must be at least 15 characters"),
  category: z.string().min(1, "Category is required"),
  departmentId: z.string().optional(),
  priority: z.string().min(1, "Priority is required"),
  isAnonymous: z.boolean(),
});

export async function raiseComplaintAction(prevState: any, formData: FormData) {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDENT") {
    return { error: "Unauthorized access" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const departmentId = formData.get("departmentId") as string;
  const priority = formData.get("priority") as string;
  const isAnonymous = formData.get("isAnonymous") === "true";
  const evidenceUrl = formData.get("evidenceUrl") as string; // Optional evidence image

  const result = raiseComplaintSchema.safeParse({
    title,
    description,
    category,
    departmentId: departmentId || undefined,
    priority,
    isAnonymous,
  });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    // Generate unique complaint ID: CV-2026-XXXXX
    let complaintId = "";
    let isUnique = false;
    while (!isUnique) {
      const randNum = Math.floor(10000 + Math.random() * 90000);
      complaintId = `CV-2026-${randNum}`;
      const existing = await db.complaint.findUnique({ where: { id: complaintId } });
      if (!existing) isUnique = true;
    }

    const complaint = await db.complaint.create({
      data: {
        id: complaintId,
        title,
        description,
        category,
        priority,
        status: "SUBMITTED",
        isAnonymous,
        departmentId: departmentId || null,
        studentId: user.id,
      },
    });

    // Add initial status update
    await db.complaintUpdate.create({
      data: {
        complaintId: complaint.id,
        authorId: user.id,
        status: "SUBMITTED",
        message: "Grievance successfully submitted on the campus portal.",
      },
    });

    // If evidence upload is simulated
    if (evidenceUrl) {
      await db.complaintEvidence.create({
        data: {
          complaintId: complaint.id,
          fileUrl: evidenceUrl,
        },
      });
    }

    // Add Notification for student
    await db.notification.create({
      data: {
        userId: user.id,
        message: `Your complaint ${complaint.id} ("${title.slice(0, 30)}...") has been submitted successfully.`,
      },
    });

    // Send notifications to Moderator representatives
    const moderators = await db.user.findMany({ where: { role: "MODERATOR" } });
    for (const mod of moderators) {
      await db.notification.create({
        data: {
          userId: mod.id,
          message: `New complaint submitted: ${complaint.id} - ${title.slice(0, 30)}...`,
        },
      });
    }

    revalidatePath("/student/complaints");
    return { success: true, complaintId: complaint.id };
  } catch (error: any) {
    return { error: error.message || "Failed to submit complaint" };
  }
}

export async function updateComplaintStatusAction(
  complaintId: string,
  status: string,
  message: string,
  isInternal: boolean = false
) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized access" };
  }

  try {
    const complaint = await db.complaint.findUnique({
      where: { id: complaintId },
      include: { student: true },
    });

    if (!complaint) {
      return { error: "Complaint not found" };
    }

    // Update complaint status
    await db.complaint.update({
      where: { id: complaintId },
      data: { status, updatedAt: new Date() },
    });

    // Create complaint update history
    await db.complaintUpdate.create({
      data: {
        complaintId,
        authorId: user.id,
        status,
        message,
        isInternal,
      },
    });

    // Notify student (if public action and complaint has a student attached)
    if (!isInternal && complaint.studentId) {
      await db.notification.create({
        data: {
          userId: complaint.studentId,
          message: `Your complaint ${complaintId} status updated to ${status.replace("_", " ")}: ${message.slice(0, 50)}...`,
        },
      });
    }

    revalidatePath(`/admin/complaints/${complaintId}`);
    revalidatePath("/admin/complaints");
    revalidatePath("/student/complaints");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update complaint status" };
  }
}

export async function assignComplaintAction(complaintId: string, departmentId: string, message: string) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized access" };
  }

  try {
    const dept = await db.department.findUnique({ where: { id: departmentId } });
    if (!dept) return { error: "Department not found" };

    const complaint = await db.complaint.findUnique({ where: { id: complaintId } });
    if (!complaint) return { error: "Complaint not found" };

    await db.complaint.update({
      where: { id: complaintId },
      data: {
        departmentId,
        status: "ASSIGNED",
        updatedAt: new Date(),
      },
    });

    await db.complaintUpdate.create({
      data: {
        complaintId,
        authorId: user.id,
        status: "ASSIGNED",
        message: `Assigned to ${dept.name} department: ${message}`,
      },
    });

    // Notify student
    if (complaint.studentId) {
      await db.notification.create({
        data: {
          userId: complaint.studentId,
          message: `Your complaint ${complaintId} has been assigned to the ${dept.name} department.`,
        },
      });
    }

    // Notify Faculty members in the target department
    const faculties = await db.user.findMany({
      where: { role: "FACULTY", departmentId },
    });
    for (const fac of faculties) {
      await db.notification.create({
        data: {
          userId: fac.id,
          message: `New complaint assigned to your department: ${complaintId}`,
        },
      });
    }

    revalidatePath(`/admin/complaints/${complaintId}`);
    revalidatePath("/admin/complaints");
    revalidatePath("/student/complaints");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to assign complaint" };
  }
}

export async function escalateComplaintAction(complaintId: string, message: string, deadlineDays: number = 3) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const complaint = await db.complaint.findUnique({
      where: { id: complaintId },
      include: { escalations: true },
    });

    if (!complaint) return { error: "Complaint not found" };

    const currentLevel = complaint.escalations.length + 1;
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + deadlineDays);

    const prevAuth = "SLIET Administrator";
    const nextAuth = "Higher Authority / Director";

    // Update status to ESCALATED
    await db.complaint.update({
      where: { id: complaintId },
      data: {
        status: "ESCALATED",
        updatedAt: new Date(),
      },
    });

    // Create Escalation log
    await db.escalation.create({
      data: {
        complaintId,
        previousAuthority: prevAuth,
        currentAuthority: nextAuth,
        escalationLevel: currentLevel,
        deadline: deadlineDate,
        status: "PENDING",
      },
    });

    // Log update history
    await db.complaintUpdate.create({
      data: {
        complaintId,
        authorId: user.id,
        status: "ESCALATED",
        message: `Escalated to ${nextAuth}. Reason: ${message}`,
      },
    });

    // Notify student
    if (complaint.studentId) {
      await db.notification.create({
        data: {
          userId: complaint.studentId,
          message: `Your complaint ${complaintId} has been escalated to ${nextAuth}.`,
        },
      });
    }

    // Notify higher admins (Directors)
    const directors = await db.user.findMany({ where: { role: "DIRECTOR" } });
    for (const dir of directors) {
      await db.notification.create({
        data: {
          userId: dir.id,
          message: `URGENT: Complaint ${complaintId} escalated to Higher Admin. Action required.`,
        },
      });
    }

    revalidatePath(`/admin/complaints/${complaintId}`);
    revalidatePath("/admin/complaints");
    revalidatePath("/student/complaints");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to escalate complaint" };
  }
}
