"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function logout() {
  (await cookies()).delete("session");
  redirect("/login");
}

export async function updatePassword(formData: any) {
  const { currentPassword, newPassword } = formData;

  try {
    const session = await getSession();
    if (!session) throw new Error("Not authenticated");

    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    });

    if (!user) throw new Error("User not found");

    // Verify current password
    const isCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isCorrect) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.userId },
      data: { password: hashedPassword }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Password update error:", error);
    return { success: false, error: error.message };
  }
}
