import { aiService } from "./ai.service";
import { courseRepository } from "@/lib/repositories/course.repo";
import { CourseOutline, CourseOutlineSchema } from "@/lib/ai/schema";
import { User } from "@prisma/client";
import { CreateCourseInput } from "@/actions/createCourse.schema";
import { youtubeService } from "./youtube.service";

export type Course = {
  id: string;
  title: string;
  level: string;
  outline: CourseOutline;
  ownerId: string;
};

export const courseService = {
  async create(data: CreateCourseInput, user: User) {
    const outline = await aiService.generateCourseOutline(data);

    const videoChapters = await Promise.all(
      outline.chapters.map(async (chapter) => {
        try{
          const video = await youtubeService.searchTopVideo(chapter.youtubeQuery)
          return {
            ...chapter,
            youtubeVideoId: video?.videoId
          }
        } catch {
          return chapter;
        }
      })
    )

    const finalOutline: CourseOutline = {
      ...outline,
      chapters: videoChapters,
    };

    return courseRepository.create({
      title: finalOutline.title,
      level: data.level,
      outline: finalOutline,
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
