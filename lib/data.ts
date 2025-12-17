import ConnectToDB from "./db";
import Course from "../models/CourseModel"


export const getCourseData = async () =>{
  await ConnectToDB();

  const courses = await Course.find({}).sort({ createdAt: -1 }).lean();

  return JSON.parse(JSON.stringify(courses));

}