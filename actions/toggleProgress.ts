"use server"

import { getCurrentUser } from "@/lib/auth";
import { progressService } from "@/services/progress.service";

export async function toggleProgress(goalId: string, skillId : string){
  const user = await getCurrentUser();

  if(!user) throw new Error("UnAuthorized");

  await progressService.toggleSkill(user.id, goalId, skillId)
}