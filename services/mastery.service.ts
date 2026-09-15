import { aiService } from "@/services/ai.service";
import { SkillStatus } from "@prisma/client";
import {
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

export const masteryService = {
  async submitEvidence(userId: string, goalSkillId: string, response: string) {
    const trimmedResponse = response.trim();
    if (trimmedResponse.length < 30) {
      throw new SkillNotReadyForMasteryError(
        "Your answer is too short. Explain your reasoning and practical approach in more detail.",
      );
    }

    const goalSkill = await masteryRepository.getSkillForEvaluation(
      userId,
      goalSkillId,
    );

    if (!goalSkill) {
      throw new Error("Skill not found");
    }

    const progress = goalSkill.progress[0];
    if (!progress || progress.status !== SkillStatus.APPLYING) {
      throw new SkillNotReadyForMasteryError();
    }

    const criteria = parseCriteria(goalSkill.masteryCriteria);
    if (criteria.length === 0) {
      throw new MasteryCriteriaMissingError();
    }

    const evaluation = await aiService.evaluateMastery({
      skillTitle: goalSkill.skill.title,
      skillDescription: goalSkill.skill.description,
      criteria,
      practice: goalSkill.lessonPractice ?? goalSkill.projectChallenge,
      response: trimmedResponse,
    });

    return masteryRepository.recordEvaluation({
      skillProgressId: progress.id,
      response: trimmedResponse,
      passed: evaluation.passed,
      score: evaluation.score,
      feedback: evaluation.feedback,
      criteriaResults: evaluation.criteriaResults,
    });
  },
};
