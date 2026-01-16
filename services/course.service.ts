import { aiService } from "./ai.service";
import { getPrisma } from "@/lib/db";
import { CourseOutline, CourseOutlineSchema } from "@/lib/ai/schema";
import { User } from "@prisma/client";

export type Course = {
  id: string;
  title: string;
  level: string;
  ownerId: string;
  outline: CourseOutline;
};

export const courseService = {
  async create(
    data: { topic: string; level: string; chapters: string; duration: string },
    user: User
  ) {
    const outline = await aiService.generateCourseOutline(
      data.topic,
      data.level,
      data.chapters,
      data.level
    );
    const prisma = await getPrisma();

    const course = await prisma.course.create({
      data: {
        title: outline.title,
        level: data.level,
        outline,
        ownerId: user.id,
      },
    });

    return course;
  },

  async getAllForUser(user: User) {
    const prisma = await getPrisma();

    const courses = prisma.course.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return (await courses).map((course) => {
      const parsedOutline = CourseOutlineSchema.parse(course.outline);

      return {
        ...course,
        outline: parsedOutline,
      };
    });
  },

  async getById(courseId: string, user: User) {
    const prisma = await getPrisma();

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        ownerId: user.id,
      },
    });

    if (!course) {
      throw new Error("Course Not Found");
    }
    const parsedOutline = CourseOutlineSchema.parse(course.outline);

    return {
      ...course,
      outline: parsedOutline,
    };
  },
};
