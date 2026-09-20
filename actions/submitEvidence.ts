"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { masteryService } from "@/services/mastery.service";
import {
  MasteryCriteriaMissingError,
  SkillNotReadyForMasteryError,
} from "@/lib/errors/domain";

export type EvidenceFormState = {
  error?: string;
  feedback?: string;
  passed?: boolean;
  score?: number;
};

export async function submitEvidence(
  _previousState: EvidenceFormState,
  formData: FormData,
): Promise<EvidenceFormState> {
  const goalId = String(formData.get("goalId") ?? "");
  const goalSkillId = String(formData.get("goalSkillId") ?? "");
  const response = String(formData.get("response") ?? "");

  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in to submit evidence." };

  try {
    const result = await masteryService.submitEvidence(
      user.id,
      goalSkillId,
      response,
    );

    revalidatePath(`/courses/${goalId}`);
    revalidatePath(`/courses/${goalId}/0`);

    return {
      feedback: result.evidence.feedback,
      passed: result.evidence.passed,
      score: result.evidence.score,
    };
  } catch (error) {
    if (error instanceof SkillNotReadyForMasteryError) {
      return { error: error.message };
    }

    if (error instanceof MasteryCriteriaMissingError) {
      return {
        error: "This skill is missing mastery criteria. Create a new goal to regenerate it.",
      };
    }

    return { error: "We could not evaluate your evidence. Please try again." };
  }
}
