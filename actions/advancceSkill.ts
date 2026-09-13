"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { goalService } from "@/services/goal.service";
import { progressService } from "@/services/progress.service";
import {
  canAdvanceToMastery,
  evaluateMasteryProof,
} from "@/lib/mastery-proof";
import { PrerequisitesNotSatisfiedError } from "@/lib/errors/domain";
import { SkillStatus } from "@prisma/client";

export type FormState = {
  error?: string;
};

function parseKeyIdeas(value: string | null) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string")
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export async function advanceSkill(
  previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const goalId = formData.get("goalId") as string;
  const goalSkillId = formData.get("goalSkillId") as string;

  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const goal = await goalService.getById(goalId, user.id);
    const goalSkill = goal.goalSkills.find((skill) => skill.id === goalSkillId);
    const currentStatus = goalSkill?.progress?.[0]?.status;
    const proofAnswer = String(formData.get("proofAnswer") ?? "");

    if (currentStatus === SkillStatus.APPLYING) {
      const evidence = parseKeyIdeas(goalSkill?.lessonKeyIdeas ?? null);
      const proofPassed = evaluateMasteryProof(
        goalSkill?.skill?.title ?? "this skill",
        evidence,
        proofAnswer,
      );

      if (!canAdvanceToMastery(proofPassed)) {
        return {
          error: "Prove your understanding before marking this skill mastered.",
        };
      }
    }

    await progressService.advanceSkill(user.id, goalSkillId);

    revalidatePath(`/courses/${goalId}`);

    return {};
  } catch (err) {
    if (err instanceof PrerequisitesNotSatisfiedError) {
      return {
        error: "You need to complete the prerequisite skills first.",
      };
    }

    throw err;
  }
}
