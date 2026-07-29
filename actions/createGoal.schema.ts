import { z } from "zod";

export const goalSchema = z
  .string()
  .trim()
  .min(3, "Goal must be at least 3 characters")
  .max(100, "Goal must be less than 100 characters");

export type GoalInput = z.infer<typeof goalSchema>;