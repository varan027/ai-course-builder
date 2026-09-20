import {
  arePrerequisitesSatisfied,
  getNextSkillStatus,
} from "@/lib/domain/progress-state";
import { progressRepository } from "@/lib/repositories/progress.repo";
import {
  PrerequisitesNotSatisfiedError,
  SkillNotReadyForMasteryError,
} from "@/lib/errors/domain";
import { SkillStatus } from "@prisma/client";

export const progressService = {
  async getSkillProgress(userId: string, goalSkillId: string) {
    return progressRepository.getSkillProgress(userId, goalSkillId);
  },

  async advanceSkill(userId: string, goalSkillId: string) {
    const existing = await progressRepository.getSkillProgress(
      userId,
      goalSkillId,
    );

    if (existing?.status === SkillStatus.MASTERED) return existing;

    if (existing?.status === SkillStatus.APPLYING) {
      throw new SkillNotReadyForMasteryError(
        "Submit mastery evidence before completing this skill.",
      );
    }

    const prerequisitesProgress =
      await progressRepository.getPrerequisiteProgress(userId, goalSkillId);

    if (!prerequisitesProgress) {
      throw new Error("Skill not found");
    }

    const prerequisiteStatuses = prerequisitesProgress.dependencies.map(
      (dependency) =>
        dependency.prerequisiteGoalSkill.progress[0]?.status ??
        SkillStatus.NOT_STARTED,
    );

    if (!arePrerequisitesSatisfied(prerequisiteStatuses)) {
      throw new PrerequisitesNotSatisfiedError();
    }

    if (!existing) {
      return progressRepository.createSkillProgress(userId, goalSkillId);
    }

    const nextStatus = getNextSkillStatus(existing.status);
    return progressRepository.updateSkillProgress(existing.id, nextStatus);
  },

  async startProject(userId: string, goalSkillId: string) {
    return progressRepository.startProject(userId, goalSkillId);
  },

  async getProgress(userId: string, goalId: string) {
    return progressRepository.getProgressForGoal(userId, goalId);
  },
};
