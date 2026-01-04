import ConnectToDB from "./db";
import Course from "../models/CourseModel"
import { CourseData } from "./types";


export const getUserCourses = async (userId: string): Promise<CourseData[]> =>{
  await ConnectToDB();

  const courses = await Course.find({ userId }).sort({ createdAt: -1 }).lean();

  return JSON.parse(JSON.stringify(courses));

}