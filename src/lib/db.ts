import "server-only";

import { PrismaClient } from "@prisma/client";

declare global {
  var __opportunityRadarPrisma: PrismaClient | undefined;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (!global.__opportunityRadarPrisma) {
    global.__opportunityRadarPrisma = new PrismaClient();
  }

  return global.__opportunityRadarPrisma;
}
