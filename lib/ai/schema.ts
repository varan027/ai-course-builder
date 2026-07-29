import { z } from "zod";

export const SkillSchema = z.object({
  id: z.string(),

  title: z.string().min(3),

  description: z.string().min(10),

  whyImportant: z.string().min(10),

  dependsOn: z.array(z.string()).default([]),

  milestone: z.string().min(5),

  projectChallenge: z.string().min(5),

  youtubeQuery: z.string().min(5),

  youtubeVideoId: z.string().optional(),
});

export const RoadmapSchema = z.object({
  goal: z.string().min(3),

  estimatedWeeks: z.number().int().positive(),

  skills: z.array(SkillSchema).min(1),
});

export type Skill = z.infer<typeof SkillSchema>;

export type Roadmap = z.infer<typeof RoadmapSchema>;