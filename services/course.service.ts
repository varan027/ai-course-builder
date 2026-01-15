import { courseStore } from "@/lib/store";
import { User } from "@/lib/users";
import { aiService, CourseOutline } from "./ai.service";
import { getPrisma } from "@/lib/db";


export type Course = {
  id: string;
  title: string;
  level: string;
  ownerId: string;
  outline: CourseOutline;
};

export const courseService = {
  async create(data: {topic : string; level: string}, user: User) {
    
    const outline = await aiService.generateCourseOutline(data.topic, data.level)
    const prisma = await getPrisma()

    const course = await prisma.course.create({
      data:{
        title: outline.title,
        level: data.level,
        outline,
        ownerId: user.id
      }
    }) 

    return course;
  },

  async getAllForUser(user: User) {
    const prisma = await getPrisma()
    
    return prisma.course.findMany({
      where: { ownerId: user.id},
      orderBy: { createdAt: "desc"}
    })
  },

  async getById(courseId: string, user: User){
    const prisma = await getPrisma()

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        ownerId: user.id,
      }
    })

    if(!course){
      throw new Error("Course Not Found")
    }

    return course;
  }
}