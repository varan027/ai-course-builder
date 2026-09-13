import { getPrisma } from "@/lib/db";
import { SkillProgress, SkillStatus } from "@prisma/client";

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
      },
    });
  },

  async startProject(userId: string, goalSkillId: string) {
    const prisma = await getPrisma();

    return prisma.skillProgress.upsert({
      where: {
        userId_goalSkillId: {
          userId,
          goalSkillId,
        },
      },
      create: {
        userId,
        goalSkillId,
        status: SkillStatus.MASTERED,
        projectStartedAt: new Date(),
      },
      update: {
        projectStartedAt: new Date(),
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
