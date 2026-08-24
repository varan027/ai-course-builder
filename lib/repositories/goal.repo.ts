import { getPrisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

type CreateGoalInput = {
  ownerId: string;

  title: string;
  estimatedWeeks: number;

  skills: {
    skillKey: string;

    skill: {
      title: string;
      description: string;
    };

    context: {
      description: string;
      whyImportant: string;
      milestone: string;
      projectChallenge: string;
    };

    prerequisites: string[];

    youtubeQuery: string;
  }[];
};

export const goalRepository = {
  async createGoalAggregate(data: CreateGoalInput) {
    const prisma = await getPrisma();

    return prisma.$transaction(async (tx) => {
      const goal = await tx.goal.create({
        data: {
          title: data.title,
          estimatedWeeks: data.estimatedWeeks,
          ownerId: data.ownerId,
        },
      });

      const skillMap = new Map<string, string>();
      for(const skill of data.skills){
        const dbSkill = await tx.skill.upsert({
          where: {
            skillKey: skill.skillKey,
          },
          create: {
            skillKey: skill.skillKey,
            title: skill.skill.title,
            description: skill.skill.description,
          },
          update: {},
        });

        skillMap.set(skill.skillKey, dbSkill.id);
      }

      const goalSkillMap = new Map<string, string>();
      for(const [index, skill] of data.skills.entries()){
        const goalSkill = await tx.goalSkill.create({
          data:{
            goalId: goal.id,
            skillId: skillMap.get(skill.skillKey)!,
            position: index + 1,

            description: skill.context.description,
            whyImportant: skill.context.whyImportant,
            milestone: skill.context.milestone,
            projectChallenge: skill.context.projectChallenge,
          },
        });

        goalSkillMap.set(skill.skillKey, goalSkill.id);
      }

      for(const skill of data.skills){
        const goalSkillId = goalSkillMap.get(skill.skillKey)!;

        for(const prerequisite of skill.prerequisites){
          const prerequisiteGoalSkillId = goalSkillMap.get(prerequisite)!;

          await tx.goalSkillDependency.create({
            data: {
              goalSkillId,
              prerequisiteGoalSkillId,
            }
          })
        }
      }

      return goal;
    });
  },

  async findAllByOwner(ownerId: string) {
    const prisma = await getPrisma();

    return prisma.goal.findMany({
      where: {
        ownerId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        goalSkills: {
          orderBy: {
            position: "asc",
          },
          include: {
            skill:true,
            progress: {
              where: {
                userId: ownerId,
              }
            }
          }
        }
      }
    })
  },

  async findOwned(goalId: string, ownerId: string) {
    const prisma = await getPrisma();

    return prisma.goal.findFirst({
      where: {
        id: goalId,
        ownerId,
      },
      include: {
        goalSkills: {
          orderBy: {
            position: "asc",
          },
          include: {
            skill: true,

            dependencies: {
              include: {
                prerequisiteGoalSkill: {
                  include: {
                    skill: true,
                  }
                }
              }
            },

            progress: {
              where: {
                userId: ownerId,
              }
            }
          }
        }
      }
    })
  }
};
