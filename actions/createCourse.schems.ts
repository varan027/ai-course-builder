import z from "zod";

export const createCourseSchema = z.object({
  topic: z.string().min(3, "Topic must be atleast 3 characters"),
  level: z.enum(["beginner", "intermediate", "advanced"])
})