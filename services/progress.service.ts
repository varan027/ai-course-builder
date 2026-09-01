import {
  arePrerequisitesSatisfied,
  getNextSkillStatus,
} from "@/lib/domain/progress-state";
import { progressRepository } from "@/lib/repositories/progress.repo";
import { PrerequisitesNotSatisfiedError } from "@/lib/errors/domain";
import { SkillStatus } from "@prisma/client";

export const progressService = {
  async advanceSkill(userId: string, goalSkillId: string) {
    const existing = await progressRepository.getSkillProgress(
      userId,
      goalSkillId,
    );

    if (existing?.status == SkillStatus.MASTERED) {
      return existing;
    }

    const prerequisitesProgress =
      await progressRepository.getPrerequisiteProgress(userId, goalSkillId);

    const allPrerequisitesStatuses =
      prerequisitesProgress?.dependencies.map((dep) => {
        const progress = dep.prerequisiteGoalSkill.progress;

        if (progress.length === 0) {
          return SkillStatus.NOT_STARTED;
        }

        return progress[0].status;
      }) ?? [];

    const isSkillAllowed = arePrerequisitesSatisfied(allPrerequisitesStatuses);

    if (!isSkillAllowed) throw new PrerequisitesNotSatisfiedError();

    if (!existing) {
      return await progressRepository.createSkillProgress(userId, goalSkillId);
    }

    const nextStatus = getNextSkillStatus(existing.status);

    return await progressRepository.updateSkillProgress(
      existing.id,
      nextStatus,
    );
  },

  async getProgress(userId: string, goalId: string) {
    return await progressRepository.getProgressForGoal(userId, goalId);
  },
};
