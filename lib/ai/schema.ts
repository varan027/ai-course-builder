import { z } from "zod";

export const LessonSchema = z.object({
  overview: z.string().min(20),
  keyIdeas: z.array(z.string().min(3)).min(2).max(6),
  content: z.string().min(50),
  practice: z.string().min(10),
});

export const MasteryProofSchema = z.object({
  task: z.string().min(20),
  proofType: z.enum([
    "CONCEPTUAL",
    "TECHNICAL",
    "ANALYTICAL",
    "PRACTICAL",
    "CREATIVE",
  ]),
  capabilities: z.array(z.string().min(10)).min(1).max(6),
  evaluationCriteria: z.array(z.string().min(10)).min(1).max(8),
});

export const MasteryEvaluationSchema = z.object({
  passed: z.boolean(),
  capabilities: z
    .array(
      z.object({
        capability: z.string().min(3),
        demonstrated: z.boolean(),
      }),
    )
    .min(1),
  feedback: z.string().min(10),
  retryGuidance: z.string().min(10),
});

const SkillBaseSchema = z.object({
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

  // Optional for persisted legacy roadmaps. New AI generation uses GeneratedSkillSchema.
  lesson: LessonSchema.optional(),
  masteryProof: MasteryProofSchema.optional(),
  prerequisites: z.array(z.string()).default([]),
  youtubeQuery: z.string().min(5),
});

export const SkillSchema = SkillBaseSchema;

export const GeneratedSkillSchema = SkillBaseSchema.extend({
  lesson: LessonSchema,
  masteryProof: MasteryProofSchema,
});

export const RoadmapSchema = z.object({
  goal: z.object({
    title: z.string().min(3),
    estimatedWeeks: z.number().int().positive(),
  }),
  skills: z.array(SkillSchema).min(1),
});

export const GeneratedRoadmapSchema = z.object({
  goal: z.object({
    title: z.string().min(3),
    estimatedWeeks: z.number().int().positive(),
  }),
  skills: z.array(GeneratedSkillSchema).min(1),
});

export type Lesson = z.infer<typeof LessonSchema>;
export type MasteryProof = z.infer<typeof MasteryProofSchema>;
export type MasteryEvaluation = z.infer<typeof MasteryEvaluationSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Roadmap = z.infer<typeof RoadmapSchema>;
