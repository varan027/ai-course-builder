import z from "zod";

export const courseInputSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),

  description: z.string().min(10, "description must be atleat 10 characters").optional(),

  level: z.enum(["Beginner", "Intermediate", "Advanced"]),

  chapters: z.number().int().min(3).max(10),

  style: z.enum(["Quality", "Speed", "Balanced"]),

  duration: z.number().int().min(1).max(10),
});

export type courseInput = z.infer<typeof courseInputSchema>
