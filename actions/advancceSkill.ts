"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { progressService } from "@/services/progress.service";
import { PrerequisitesNotSatisfiedError } from "@/lib/errors/domain";
import { SkillStatus } from "@prisma/client";

export type FormState = {
  error?: string;
};

export async function advanceSkill(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const goalId = String(formData.get("goalId") ?? "");
  const goalSkillId = String(formData.get("goalSkillId") ?? "");
  const user = await getCurrentUser();

  if (!user) return { error: "Please sign in to continue." };
  if (!goalId || !goalSkillId) return { error: "Invalid skill selection." };

  try {
    const progress = await progressService.getSkillProgress(
      user.id,
      goalSkillId,
    );

    if (progress?.status === SkillStatus.APPLYING) {
      return { error: "Submit mastery evidence before completing this skill." };
    }

    await progressService.advanceSkill(user.id, goalSkillId);
    revalidatePath(`/courses/${goalId}`);
    revalidatePath(`/courses/${goalId}/${formData.get("chapterId") ?? "0"}`);
    return {};
  } catch (error) {
    if (error instanceof PrerequisitesNotSatisfiedError) {
      return { error: "You need to complete the prerequisite skills first." };
    }

    return { error: "We could not update your progress. Please try again." };
  }
}
