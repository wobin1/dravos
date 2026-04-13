"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function upsertEmployee(formData: any) {
  const { id, email, name, password, monthlySalary, dailyVideoTarget, workingDaysPerMonth, youtubeChannelId } = formData;

  try {
    const data: any = {
      email,
      name,
      monthlySalary: parseFloat(monthlySalary),
      dailyVideoTarget: parseInt(dailyVideoTarget),
      workingDaysPerMonth: parseInt(workingDaysPerMonth),
      youtubeChannelId,
      role: "EMPLOYEE",
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    if (id) {
      await prisma.user.update({
        where: { id },
        data,
      });
    } else {
      if (!password) throw new Error("Password is required for new employees");
      await prisma.user.create({
        data,
      });
    }

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error upserting employee:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteEmployee(userId: string) {
  try {
    // 1. Verify session and role
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      throw new Error("Unauthorized: Only admins can delete employees");
    }

    // 2. Prevent deleting self
    if (session.userId === userId) {
      throw new Error("You cannot delete your own account");
    }

    // 3. Delete user (submissions and performance will cascade delete)
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting employee:", error);
    return { success: false, error: error.message };
  }
}
