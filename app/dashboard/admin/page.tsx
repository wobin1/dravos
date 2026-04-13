import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EmployeeDirectory from "./EmployeeDirectory";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/dashboard/employee");

  const users = await prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    include: {
      _count: {
        select: { submissions: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return <EmployeeDirectory initialUsers={users} />;
}
