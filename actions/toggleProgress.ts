"use server"

import { getCurrentUser } from "@/lib/auth";
import { progressService } from "@/services/progress.service";

export async function toggleProgress(courseId: string, chapter: number){
  const user = await getCurrentUser();

  if(!user) throw new Error("UnAuthorized");

  await progressService.toggleChapter(user.id, courseId, chapter)
}