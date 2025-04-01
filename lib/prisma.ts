import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Log Prisma connection issues and add retry logic
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ["query", "error", "warn"],
      errorFormat: "pretty",
    });
  }
  prisma = globalForPrisma.prisma;
}

// Verify connection on startup
const verifyConnection = async () => {
  try {
    // Simple query to test connection
    await prisma.$queryRaw`SELECT 1 as connection_test`;
    console.log("✅ Database connection established successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    console.log("Database URL format (without credentials):", 
      process.env.DATABASE_URL?.replace(/\/\/[^:]+:[^@]+@/, "//***:***@"));
    
    // Provide troubleshooting advice
    console.log("\nTroubleshooting steps:");
    console.log("1. Verify your DATABASE_URL in .env is correct");
    console.log("2. Ensure your NeonDB instance is running");
    console.log("3. Check if your IP is allowed in NeonDB's IP allowlist");
    console.log("4. Ensure the database exists and user has proper permissions");
  }
};

// Run verification in development, but don't block startup
if (process.env.NODE_ENV !== "production") {
  verifyConnection();
}

export default prisma;

