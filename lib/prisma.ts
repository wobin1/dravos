import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  (() => {
    const connectionString = process.env.DATABASE_URL || "postgresql://postgres:@localhost:5432/epeetec_db?sslmode=disable";
    
    const pool = new pg.Pool({ 
      connectionString,
      ssl: false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ 
      adapter, 
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
    });
  })();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
