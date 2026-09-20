"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { progressService } from "@/services/progress.service";
import {
  PrerequisitesNotSatisfiedError,
  SkillNotReadyForMasteryError,
} from "@/lib/errors/domain";

export type FormState = {
  error?: string;
};

export async function advanceSkill(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const goalId = String(formData.get("goalId") ?? "");
  const goalSkillId = String(formData.get("goalSkillId") ?? "");
  const chapterId = String(formData.get("chapterId") ?? "0");
  const user = await getCurrentUser();

  if (!user) return { error: "Please sign in to continue." };
  if (!goalId || !goalSkillId) return { error: "Invalid skill selection." };

  try {
    await progressService.advanceSkill(user.id, goalSkillId);
    revalidatePath(`/courses/${goalId}`);
    revalidatePath(`/courses/${goalId}/${chapterId}`);
    return {};
  } catch (error) {
    if (error instanceof PrerequisitesNotSatisfiedError) {
      return { error: "You need to complete the prerequisite skills first." };
    }

    if (error instanceof SkillNotReadyForMasteryError) {
      return { error: error.message };
    }

    return { error: "We could not update your progress. Please try again." };
  }
}
