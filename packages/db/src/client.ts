import { readFileSync } from "fs";
import path from "path";
import dotenv from "dotenv";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

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

  // Aiven (and similar hosts) use a private CA. Provide it via DATABASE_CA_PATH
  // (path to ca.pem) or DATABASE_CA (PEM contents). sslmode is stripped from the
  // URL so the explicit ssl option below is what pg uses.
  const caPem =
    process.env.DATABASE_CA ??
    (process.env.DATABASE_CA_PATH
      ? readFileSync(
          path.resolve(__dirname, "../../..", process.env.DATABASE_CA_PATH),
          "utf8",
        )
      : undefined);

  let connectionString = databaseUrl;
  let ssl: { ca: string; rejectUnauthorized: true } | undefined;
  if (caPem) {
    const url = new URL(databaseUrl);
    url.searchParams.delete("sslmode");
    connectionString = url.toString();
    ssl = { ca: caPem, rejectUnauthorized: true };
  }

  const adapter = new PrismaPg({ connectionString, ssl });

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
