import { aiService } from "@/services/ai.service";
import { SkillStatus } from "@prisma/client";
import {
  AIOutputInvalidError,
  MasteryCriteriaMissingError,
  SkillNotReadyForMasteryError,
} from "@/lib/errors/domain";
import { masteryRepository } from "@/lib/repositories/mastery.repo";

function parseCriteria(value: string | null): string[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string")
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function validateEvaluation(criteria: string[], evaluation: Awaited<ReturnType<typeof aiService.evaluateMastery>>) {
  const expected = new Set(criteria);
  const seen = new Set<string>();

  for (const result of evaluation.criteriaResults) {
    if (!expected.has(result.criterion) || seen.has(result.criterion)) {
      throw new AIOutputInvalidError("Mastery evaluation did not cover the required criteria exactly once");
    }
    seen.add(result.criterion);
  }

  if (seen.size !== expected.size) {
    throw new AIOutputInvalidError("Mastery evaluation omitted one or more required criteria");
  }

  return evaluation.passed && evaluation.criteriaResults.every((result) => result.passed);
}

export const masteryService = {
  async submitEvidence(userId: string, goalSkillId: string, response: string) {
    const trimmedResponse = response.trim();
    if (trimmedResponse.length < 30) {
      throw new SkillNotReadyForMasteryError(
        "Your answer is too short. Explain your reasoning and practical approach in more detail.",
      );
    }

    const goalSkill = await masteryRepository.getSkillForEvaluation(userId, goalSkillId);
    if (!goalSkill) throw new Error("Skill not found");

    const progress = goalSkill.progress[0];
    if (!progress || progress.status !== SkillStatus.APPLYING) {
      throw new SkillNotReadyForMasteryError();
    }

    const criteria = parseCriteria(goalSkill.masteryCriteria);
    if (criteria.length === 0) throw new MasteryCriteriaMissingError();

    const evaluation = await aiService.evaluateMastery({
      skillTitle: goalSkill.skill.title,
      skillDescription: goalSkill.skill.description,
      criteria,
      practice: goalSkill.lessonPractice ?? goalSkill.projectChallenge,
      response: trimmedResponse,
    });

    const passed = validateEvaluation(criteria, evaluation);

    return masteryRepository.recordEvaluation({
      skillProgressId: progress.id,
      response: trimmedResponse,
      passed,
      score: evaluation.score,
      feedback: evaluation.feedback,
      criteriaResults: evaluation.criteriaResults,
    });
  },
};
