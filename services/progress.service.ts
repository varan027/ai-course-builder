import { getPrisma } from "@/lib/db";
import { SkillStatus } from "@prisma/client";

const SKILL_PROGRESS_FLOW: SkillStatus[] = [
  SkillStatus.NOT_STARTED,
  SkillStatus.EXPLORING,
  SkillStatus.PRACTICING,
  SkillStatus.APPLYING,
  SkillStatus.MASTERED,
];

function getNextSkillStatus(current: SkillStatus): SkillStatus {
  const currentIndex = SKILL_PROGRESS_FLOW.indexOf(current);

  if (currentIndex === -1) {
    throw new Error("Invalid skill status");
  }

  if (currentIndex === SKILL_PROGRESS_FLOW.length - 1) {
    return current;
  }

  return SKILL_PROGRESS_FLOW[currentIndex + 1];
}

export const progressService = {
  async advanceSkill(userId: string, goalSkillId: string) {
    const prisma = await getPrisma();

    const existing = await prisma.skillProgress.findUnique({
      where: {
        userId_goalSkillId: {
          userId,
          goalSkillId,
        },
      },
    });

    if (!existing) {
      return prisma.skillProgress.create({
        data: {
          userId,
          goalSkillId,
          status: SkillStatus.EXPLORING,
        },
      });
    }

    const nextStatus = getNextSkillStatus(existing.status);

    return prisma.skillProgress.update({
      where: {
        id: existing.id,
      },
      data: {
        status: nextStatus,
      },
    });
  },

  async getProgress(userId: string, goalId: string) {
    const prisma = await getPrisma();

    return prisma.skillProgress.findMany({
      where: {
        userId,
        goalSkill: {
          goalId,
        },
      },
    });
  },
};