import { z } from "zod";

/**
 * A single chapter in a course
 * - durationMinutes is decided by AI
 * - youtubeQuery is used by UI only
 */
export const ChapterSchema = z.object({
  title: z.string().min(3),
  about: z.string().min(10),
  durationMinutes: z.number().int().positive(),
  youtubeQuery: z.string().min(5),
});

/**
 * Final AI output contract
 * This schema is used by:
 * - AI validation
 * - Database JSON validation
 * - UI rendering
 */
export const CourseOutlineSchema = z.object({
  title: z.string().min(3),
  chapters: z.array(ChapterSchema).min(1),
});

export type CourseOutline = z.infer<typeof CourseOutlineSchema>;
