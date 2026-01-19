import { getPrisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const courseRepository = {
  async create(data: {
    title: string;
    level: string;
    outline: Prisma.InputJsonValue;
    ownerId: string;
  }) {
    const prisma = await getPrisma();

    return prisma.course.create({
      data,
    });
  },

  async findAllByOwner(ownerId: string) {
    const prisma = await getPrisma();

    return prisma.course.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
    });
  },

  async findOwned(courseId: string, ownerId: string) {
    const prisma = await getPrisma();

    return prisma.course.findFirst({
      where: { id: courseId, ownerId },
    });
  },
};
