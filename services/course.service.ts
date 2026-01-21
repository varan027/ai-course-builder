import { aiService } from "./ai.service";
import { courseRepository } from "@/lib/repositories/course.repo";
import { CourseOutline, CourseOutlineSchema } from "@/lib/ai/schema";
import { User } from "@prisma/client";
import { CreateCourseInput } from "@/actions/createCourse.schema";

export type Course = {
  id: string;
  title: string;
  level: string;
  outline: CourseOutline;
  ownerId: string;
};

export const courseService = {
  async create(data: CreateCourseInput, user: User) {
    // 1. Ask AI for course outline
    const outline = await aiService.generateCourseOutline(data);

    // 2. Save using repository
    return courseRepository.create({
      title: outline.title,
      level: data.level,
      outline,
      ownerId: user.id,
    });
  },

  async getAllForUser(user: User) {
    const courses = await courseRepository.findAllByOwner(user.id);

    return courses.map((course) => ({
      ...course,
      outline: CourseOutlineSchema.parse(course.outline),
    }));
  },

  async getById(courseId: string, user: User) {
    const course = await courseRepository.findOwned(courseId, user.id);

    if (!course) {
      throw new Error("Course not found");
    }

    return {
      ...course,
      outline: CourseOutlineSchema.parse(course.outline),
    };
  },
};
