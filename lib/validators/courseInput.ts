import z from "zod";

export const courseInputSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),

  description: z.string().min(10, "description must be atleat 10 characters"),

  level: z.enum(["Beginner", "Intermediate", "Advanced"]),

  chapters: z.enum(["3", "4", "5", "6"]),

  style: z.enum(["Quality", "Speed", "Balanced"]),

  duration: z.enum(["1h", "2h", "5h"]),
});

export type courseInput = z.infer<typeof courseInputSchema>
