"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { progressService } from "@/services/progress.service";
import { PrerequisitesNotSatisfiedError } from "@/lib/errors/domain";

export type FormState = {
  error?: string;
};

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