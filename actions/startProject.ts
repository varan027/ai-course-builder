"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { goalService } from "@/services/goal.service";
import { progressService } from "@/services/progress.service";
import { SkillStatus } from "@prisma/client";

export type FormState = {
  error?: string;
};

export async function startProject(
  previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const goalId = String(formData.get("goalId") ?? "");
  const goalSkillId = String(formData.get("goalSkillId") ?? "");

  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const goal = await goalService.getById(goalId, user.id);
  const goalSkill = goal.goalSkills.find((skill) => skill.id === goalSkillId);
  const currentStatus = goalSkill?.progress?.[0]?.status;

  if (!goalSkill || currentStatus !== SkillStatus.MASTERED) {
    return { error: "Master the skill before starting this project." };
  }

  if (!goalSkill.projectChallenge.trim()) {
    return { error: "This skill does not have a project challenge yet." };
  }

  await progressService.startProject(user.id, goalSkillId);
  revalidatePath(`/courses/${goalId}`);
  revalidatePath(`/courses/${goalId}/0`);
  return {};
}
