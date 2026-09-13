"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { goalService } from "@/services/goal.service";
import { progressService } from "@/services/progress.service";
import { aiService } from "@/services/ai.service";
import { canAdvanceToMastery, parseMasteryProof } from "@/lib/mastery-proof";
import { PrerequisitesNotSatisfiedError } from "@/lib/errors/domain";
import { SkillStatus } from "@prisma/client";

export type FormState = {
  error?: string;
  feedback?: string;
  retryGuidance?: string;
};

function parseKeyIdeas(value: string | null) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string") ? parsed : [];
  } catch {
    return [];
  }
}

export async function advanceSkill(
  previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  void previousState;
  const goalId = String(formData.get("goalId") ?? "");
  const goalSkillId = String(formData.get("goalSkillId") ?? "");
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  try {
    const goal = await goalService.getById(goalId, user.id);
    const goalSkill = goal.goalSkills.find((skill) => skill.id === goalSkillId);
    const currentStatus = goalSkill?.progress?.[0]?.status;

    if (!goalSkill) return { error: "Skill not found." };

    if (currentStatus === SkillStatus.APPLYING) {
      const proof = parseMasteryProof({
        task: goalSkill.masteryProofTask,
        proofType: goalSkill.masteryProofType,
        capabilities: goalSkill.masteryProofCapabilities,
        evaluationCriteria: goalSkill.masteryProofCriteria,
      });
      const learnerEvidence = String(formData.get("proofAnswer") ?? "").trim();

      if (!proof) {
        return { error: "This skill does not have a mastery proof yet. Create a new goal to get an evidence checkpoint." };
      }

      if (!learnerEvidence) {
        return { error: "Submit your evidence before completing this skill." };
      }

      const evaluation = await aiService.evaluateMasteryProof({
        skillTitle: goalSkill.skill.title,
        skillDescription: goalSkill.description,
        lessonOverview: goalSkill.lessonOverview ?? goalSkill.description,
        keyIdeas: parseKeyIdeas(goalSkill.lessonKeyIdeas),
        proofTask: proof.task,
        proofType: proof.proofType,
        capabilities: proof.capabilities,
        evaluationCriteria: proof.evaluationCriteria,
        learnerEvidence,
      });

      if (!canAdvanceToMastery(evaluation)) {
        return {
          feedback: evaluation.feedback,
          retryGuidance: evaluation.retryGuidance,
        };
      }
    }

    await progressService.advanceSkill(user.id, goalSkillId);
    revalidatePath(`/courses/${goalId}`);
    revalidatePath(`/courses/${goalId}/${goal.goalSkills.findIndex((skill) => skill.id === goalSkillId)}`);
    return {};
  } catch (err) {
    if (err instanceof PrerequisitesNotSatisfiedError) {
      return { error: "You need to complete the prerequisite skills first." };
    }
    throw err;
  }
}
