import { z } from "zod";

export const ChapterSchema = z.object({
  title: z.string().min(3),
  about: z.string().min(10),
  durationMinutes: z.number().int().positive(),
  youtubeQuery: z.string().min(5),
  youtubeVideoId: z.string().optional(),
});

export const CourseOutlineSchema = z.object({
  title: z.string().min(3),
  chapters: z.array(ChapterSchema).min(1),
});

export type CourseOutline = z.infer<typeof CourseOutlineSchema>;
