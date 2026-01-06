import CourseModel from "@/models/CourseModel";
import ConnectToDB from "./db";
import { CourseData } from "./types";

export const courseOwner = async (
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

  return course as CourseData;
};
