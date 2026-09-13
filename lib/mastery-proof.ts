import {
  MasteryEvaluationSchema,
  MasteryProofSchema,
  type MasteryEvaluation,
  type MasteryProof,
} from "@/lib/ai/schema";

export function parseMasteryProof(input: {
  task: string | null;
  proofType: string | null;
  capabilities: string | null;
  evaluationCriteria: string | null;
}): MasteryProof | null {
  if (!input.task || !input.proofType || !input.capabilities || !input.evaluationCriteria) return null;

  try {
    const result = MasteryProofSchema.safeParse({
      task: input.task,
      proofType: input.proofType,
      capabilities: JSON.parse(input.capabilities),
      evaluationCriteria: JSON.parse(input.evaluationCriteria),
    });
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function parseMasteryEvaluation(input: unknown): MasteryEvaluation | null {
  const result = MasteryEvaluationSchema.safeParse(input);
  return result.success ? result.data : null;
}

export function canAdvanceToMastery(
  evaluation: MasteryEvaluation | null,
  requiredCapabilityCount = 1,
): boolean {
  if (!evaluation || !evaluation.passed) return false;
  if (evaluation.capabilities.length !== requiredCapabilityCount) return false;

  const indexes = evaluation.capabilities.map((item) => item.capabilityIndex);
  if (new Set(indexes).size !== requiredCapabilityCount) return false;
  if (indexes.some((index) => index < 0 || index >= requiredCapabilityCount)) return false;

  return evaluation.capabilities.every((item) => item.demonstrated);
}

export function getMasteryProofPrompt(skillTitle: string, practice: string, question?: string): string {
  return [
    `You have just studied the skill "${skillTitle}".`,
    "",
    "Prove that you can apply it rather than simply recall its definition.",
    `Practice context: ${practice}`,
    question ? `Checkpoint question: ${question}` : "",
    "",
    "Write a short response explaining what you would do, why you would do it, and what result you would expect.",
  ].filter(Boolean).join("\n");
}
