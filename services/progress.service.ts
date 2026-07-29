import { getPrisma } from "@/lib/db";

export const progressService = {
  async toggleSkill(
    userId: string,
    goalId: string,
    skillId: string
  ) {
    const prisma = await getPrisma();

    const existing = await prisma.skillProgress.findUnique({
      where: {
        userId_goalId_skillId: {
          userId,
          goalId,
          skillId,
        },
      },
    });

    if (existing) {
      return prisma.skillProgress.update({
        where: {
          id: existing.id,
        },
        data: {
          status:
            existing.status === "MASTERED"
              ? "NOT_STARTED"
              : "MASTERED",
        },
      });
    }

    return prisma.skillProgress.create({
      data: {
        userId,
        goalId,
        skillId,
        status: "MASTERED",
      },
    });
  },

  async getProgress(
    userId: string,
    goalId: string
  ) {
    const prisma = await getPrisma();

    return prisma.skillProgress.findMany({
      where: {
        userId,
        goalId,
      },
    });
  },
};