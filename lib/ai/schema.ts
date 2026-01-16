import z from "zod";

export const CourseConfigSchema = z.object({
  level: z.enum(["beginner", "intermediate", "advanced"]),
  durationMinutes: z.enum(["5", "10", "15"]),
  chapterCount: z.enum(["5", "8", "12"]),
});


export const ChapterSchema = z.object({
  title: z.string().min(3),
  about: z.string().min(10),
  youtubeQuery: z.string().min(5)
})

export const CourseOutlineSchema = z.object({
  title: z.string().min(3),
  chapters: z.array(ChapterSchema).min(1)
})

export type CourseOutline = z.infer<typeof CourseOutlineSchema>