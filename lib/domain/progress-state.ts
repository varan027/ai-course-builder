import { SkillStatus } from "@prisma/client";

export const SKILL_PROGRESS_TRANSITIONS: Record<
  SkillStatus,
  SkillStatus | null
> = {
  [SkillStatus.NOT_STARTED]: SkillStatus.EXPLORING,
  [SkillStatus.EXPLORING]: SkillStatus.PRACTICING,
  [SkillStatus.PRACTICING]: SkillStatus.APPLYING,
  [SkillStatus.APPLYING]: SkillStatus.MASTERED,
  [SkillStatus.MASTERED]: null,
};

export function canAdvanceSkill(status: SkillStatus): boolean {
  return SKILL_PROGRESS_TRANSITIONS[status] !== null;
}

export function getNextSkillStatus(status: SkillStatus): SkillStatus {
  const nextStatus = SKILL_PROGRESS_TRANSITIONS[status];

  if (nextStatus === null) {
    throw new Error("Skill is already mastered");
  }

  return nextStatus;
}

export function arePrerequisitesSatisfied(
  prerequisiteStatuses: SkillStatus[],
): boolean {
  return prerequisiteStatuses.every((status) => status === SkillStatus.MASTERED);
}
