import z from "zod";

export const CourseConfigSchema = z.object({
  topic: z.string().min(3),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  chapters: z.enum(["5", "8", "12"]),
  duration: z.enum(["30", "60", "90"]),
});

export type CourseConfig = z.infer<typeof CourseConfigSchema>;

export const ChapterSchema = z.object({
  title: z.string().min(3),
  about: z.string().min(10),
  durationMinutes: z.number().int().positive(),
  youtubeQuery: z.string().min(5)
})

export const CourseOutlineSchema = z.object({
  title: z.string().min(3),
  chapters: z.array(ChapterSchema).min(1)
})

export type CourseOutline = z.infer<typeof CourseOutlineSchema>