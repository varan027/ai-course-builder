import { getPrisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const goalRepository = {
  async create(data: {
    title: string;
    roadmap: Prisma.InputJsonValue;
    ownerId: string;
  }) {
    const prisma = await getPrisma();

    return prisma.goal.create({
      data: {
        title: data.title,
        roadmap: data.roadmap,
        ownerId: data.ownerId,
      },
    });
  },

  async findAllByOwner(ownerId: string) {
    const prisma = await getPrisma();

    return prisma.goal.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
    });
  },

  async findOwned(goalId: string, ownerId: string) {
    const prisma = await getPrisma();

    return prisma.goal.findFirst({
      where: {
        id: goalId,
        ownerId,
      },
    });
  },
};