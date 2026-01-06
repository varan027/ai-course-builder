import CourseModel from "@/models/CourseModel";
import ConnectToDB from "./db";
import { CourseData } from "./types";

export const assertCourseOwner = async (
  courseId: string,
  userId: string
): Promise<CourseData> => {
  await ConnectToDB();

  const course = await CourseModel.findOne({
    _id: courseId,
    userId,
  }).lean();

  if (!course) {
    throw new Error("Not allowed");
  }

  return {
    ...course,
    _id: course._id.toString(),
    createdAt: course.createdAt?.toISOString(),
    chapters: course.chapters?.map((chapter: any) => ({
      ...chapter,
      _id: chapter._id?.toString(),
    })),
  } as CourseData;
};
