import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

// We'll try the direct connection first since we are in a Node environment
// Prisma 7 should still support this if passed in the constructor
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed with DATABASE_URL:", process.env.DATABASE_URL ? "Defined" : "UNDEFINED");
  
  const adminPassword = await bcrypt.hash("admin123", 10);
  const employeePassword = await bcrypt.hash("employee123", 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@epeetec.com" },
    update: {},
    create: {
      email: "admin@epeetec.com",
      name: "Super Admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create Employee
  const employee = await prisma.user.upsert({
    where: { email: "employee@epeetec.com" },
    update: {},
    create: {
      email: "employee@epeetec.com",
      name: "John Doe",
      password: employeePassword,
      role: "EMPLOYEE",
      monthlySalary: 3000,
      dailyVideoTarget: 3,
      workingDaysPerMonth: 22,
      youtubeChannelId: "UC_x5XG1OV2P6uYZ5FHSzXxA", // Example Channel ID
    },
  });

  console.log("Seeding successful:");
  console.log({ admin: admin.email, employee: employee.email });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
