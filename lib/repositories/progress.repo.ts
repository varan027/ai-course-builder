import { getPrisma } from "@/lib/db";
import { SkillStatus } from "@prisma/client";

export const progressRepository = {
  async getPrerequisiteProgress(userId: string, goalSkillId: string) {
    const prisma = await getPrisma();

    return prisma.goalSkill.findUnique({
      where: {
        id: goalSkillId,
        goal: {
          ownerId: userId,
        },
      },
      include: {
        dependencies: {
          include: {
            prerequisiteGoalSkill: {
              include: {
                progress: {
                  where: {
                    userId,
                  },
                },
              },
            },
          },
        },
      },
    });
  },

  async getSkillProgress(userId: string, goalSkillId: string) {
    const prisma = await getPrisma();

    return prisma.skillProgress.findUnique({
      where: {
        userId_goalSkillId: {
          userId,
          goalSkillId,
        },
      },
    });
  },

  async createSkillProgress(userId: string, goalSkillId: string) {
    const prisma = await getPrisma();

    return prisma.skillProgress.create({
      data: {
        userId,
        goalSkillId,
        status: SkillStatus.EXPLORING,
      },
    });
  },

  async updateSkillProgress(progressId: string, nextStatus: SkillStatus) {
    const prisma = await getPrisma();

    return prisma.skillProgress.update({
      where: {
        id: progressId,
      },
      data: {
        status: nextStatus,
        completedAt:
          nextStatus === SkillStatus.MASTERED ? new Date() : undefined,
      },
    });
  },

  async startProject(userId: string, goalSkillId: string) {
    const prisma = await getPrisma();

    const progress = await prisma.skillProgress.findUnique({
      where: {
        userId_goalSkillId: {
          userId,
          goalSkillId,
        },
      },
    });

    if (!progress || progress.status !== SkillStatus.MASTERED) {
      throw new Error("Skill must be mastered before starting the project");
    }

    return prisma.skillProgress.update({
      where: {
        id: progress.id,
      },
      data: {
        projectStartedAt: progress.projectStartedAt ?? new Date(),
      },
    });
  },

  async getProgressForGoal(userId: string, goalId: string) {
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
