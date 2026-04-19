import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  (() => {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    
    // Parse the connection string to handle SSL modes properly
    const url = new URL(connectionString);
    const isProduction = process.env.NODE_ENV === "production";
    
    // Remove SSL mode from URL params to avoid the warning
    const sslMode = url.searchParams.get('sslmode');
    url.searchParams.delete('sslmode');
    
    // Add libpq compatibility if SSL is required
    if (sslMode && ['prefer', 'require', 'verify-ca'].includes(sslMode)) {
      url.searchParams.set('uselibpqcompat', 'true');
      url.searchParams.set('sslmode', 'require');
    } else if (sslMode === 'verify-full') {
      url.searchParams.set('sslmode', 'verify-full');
    }
    
    // Determine SSL configuration for the pool
    const sslConfig = isProduction || sslMode !== 'disable'
      ? { rejectUnauthorized: false } // For production or when SSL is enabled
      : false; // For local development without SSL
    
    const pool = new pg.Pool({ 
      connectionString: url.toString(),
      ssl: sslConfig,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    
    const adapter = new PrismaPg(pool);
    
    // Test the connection
    pool.on('error', (err) => {
      console.error('Database pool error:', err);
    });
    
    return new PrismaClient({ 
      adapter, 
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
    });
  })();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
