"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { progressService } from "@/services/progress.service";

export async function advanceSkill(goalId: string, skillId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await progressService.advanceSkill(user.id, goalId, skillId);

  revalidatePath(`/courses/${goalId}`);
}