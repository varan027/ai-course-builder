import z from "zod";

export const createCourseSchema = z.object({
  topic: z.string().min(3, "Topic must be atleast 3 characters"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  chapters: z.enum(["5", "8", "12"]),
  duration: z.enum(["30", "60", "90"]),
})

export type CreateCourseInput = z.infer<typeof createCourseSchema>;