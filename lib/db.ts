import type { PrismaClient as PrismaClientType } from "@prisma/client";

let prisma: PrismaClientType | null = null;

export async function getPrisma() {
  if (prisma) return prisma;

  const { PrismaClient } = await import("@prisma/client");
  prisma = new PrismaClient({
    log: ["error"],
  });

  return prisma;
}
