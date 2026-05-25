import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client";

let prismaInstance: PrismaClient | null = null;

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function initializePrisma(): PrismaClient {
  if (prismaInstance) {
    return prismaInstance;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined");
  }

  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  });

  prismaInstance =
    global.prisma ??
    new PrismaClient({
      adapter,

      // optional query logs
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    global.prisma = prismaInstance;
  }

  return prismaInstance;
}

export const prisma = new Proxy({} as PrismaClient, {
  get: (_target, prop) => {
    const instance = initializePrisma();
    return (instance as any)[prop];
  },
});

export type { PrismaClient };
