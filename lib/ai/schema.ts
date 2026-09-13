import { z } from "zod";

export const LessonSchema = z.object({
  overview: z.string().min(20),
  keyIdeas: z.array(z.string().min(3)).min(2).max(6),
  content: z.string().min(50),
  practice: z.string().min(10),
});

export const SkillSchema = z.object({
  skillKey: z
    .string()
    .min(2)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "skillKey must use lowercase kebab-case",
    ),

  skill: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
  }),

  context: z.object({
    description: z.string().min(10),
    whyImportant: z.string().min(10),
    milestone: z.string().min(5),
    projectChallenge: z.string().min(5),
  }),

  // Optional for backwards compatibility with roadmaps created before
  // structured lessons were introduced. New AI-generated roadmaps include it.
  lesson: LessonSchema.optional(),

  prerequisites: z.array(z.string()).default([]),

  youtubeQuery: z.string().min(5),
});

export const RoadmapSchema = z.object({
  goal: z.object({
    title: z.string().min(3),
    estimatedWeeks: z.number().int().positive(),
  }),

  skills: z.array(SkillSchema).min(1),
});

export type Lesson = z.infer<typeof LessonSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Roadmap = z.infer<typeof RoadmapSchema>;
