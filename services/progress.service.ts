import { getPrisma } from "@/lib/db"


export const progressService =  {
  async toggleChapter(userId: string, courseId: string, chapter: number){
    const prisma = await getPrisma();

    const existing = await prisma.chapterProgress.findUnique({
      where: {
        userId_courseId_chapter: {
          userId,
          courseId,
          chapter,
        },
      }
    })

    if(existing){
      return prisma.chapterProgress.update({
        where: { id: existing.id },
        data: { completed:!existing.completed }
      });
    }

    return prisma.chapterProgress.create({
      data: {
        userId,
        courseId,
        chapter,
        completed: true,
      }
    })
  },

  async getProgress(userId: string, courseId: string){
    const prisma = await getPrisma();

    return prisma.chapterProgress.findMany({
      where: { userId, courseId }
    })
  }
}