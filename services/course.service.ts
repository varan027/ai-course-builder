import { aiService } from "./ai.service";
import { getPrisma } from "@/lib/db";
import { CourseConfigSchema, CourseOutline, CourseOutlineSchema } from "@/lib/ai/schema";
import { User } from "@prisma/client";
import { CreateCourseInput } from "@/actions/createCourse.schema";

export type Course = {
  id: string;
  title: string;
  level: string;
  ownerId: string;
  outline: CourseOutline;
};

export const courseService = {
  async create(
    data: CreateCourseInput,
    user: User
  ) {
    const outline = await aiService.generateCourseOutline(
      {
        topic: data.topic,
        level: data.level,
        chapters: data.chapters,
        duration: data.duration,
      }
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


function toAIConfig(input: CreateCourseInput) {
  return CourseConfigSchema.parse({
    topic: input.topic,
    level: input.level,
    chapters: input.chapters,
    duration: input.duration,
  });
}
