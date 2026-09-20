import { getPrisma } from "@/lib/db";
import { SkillStatus } from "@prisma/client";

export const masteryRepository = {
  async getSkillForEvaluation(userId: string, goalSkillId: string) {
    const prisma = await getPrisma();

    return prisma.goalSkill.findFirst({
      where: {
        id: goalSkillId,
        goal: { ownerId: userId },
      },
      include: {
        skill: true,
        progress: {
          where: { userId },
          include: {
            evidence: {
              orderBy: { createdAt: "desc" },
              take: 5,
            },
          },
        },
      },
    });
  },

  async recordEvaluation(input: {
    skillProgressId: string;
    response: string;
    passed: boolean;
    score: number;
    feedback: string;
    criteriaResults: unknown;
  }) {
    const prisma = await getPrisma();

    return prisma.$transaction(async (tx) => {
      const progress = await tx.skillProgress.findUnique({
        where: { id: input.skillProgressId },
        select: { status: true },
      });

      if (!progress || progress.status !== SkillStatus.APPLYING) {
        throw new Error("Skill is no longer ready for mastery evaluation");
      }

      const evidence = await tx.evidence.create({
        data: {
          skillProgressId: input.skillProgressId,
          response: input.response,
          passed: input.passed,
          score: input.score,
          feedback: input.feedback,
          criteriaResults: input.criteriaResults as object,
        },
      });

      if (!input.passed) {
        return { evidence, status: SkillStatus.APPLYING };
      }

      const masteredProgress = await tx.skillProgress.update({
        where: { id: input.skillProgressId },
        data: {
          status: SkillStatus.MASTERED,
          completedAt: new Date(),
        },
      });

      return { evidence, status: masteredProgress.status };
    });
  },
};
