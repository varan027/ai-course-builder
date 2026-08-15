import { SkillStatus } from "@prisma/client";

/**
 * The allowed forward progression through a skill.
 * Keeping these rules outside the persistence layer makes them reusable
 * from actions, assessments, projects, and future automation.
 */
export const SKILL_PROGRESS_TRANSITIONS: Record<SkillStatus, SkillStatus | null> = {
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
