export const PROGRESS_STAGES = [
  "NOT_STARTED",
  "EXPLORING",
  "PRACTICING",
  "APPLYING",
  "MASTERED",
] as const;

export type ProgressStage = (typeof PROGRESS_STAGES)[number];

export type LearningSkill = {
  mastered: boolean;
};

export function getProgressStageIndex(stage: ProgressStage): number {
  return PROGRESS_STAGES.indexOf(stage);
}

export function getNextSkillIndex(
  skills: LearningSkill[],
  currentIndex: number,
): number | undefined {
  const next = skills.findIndex(
    (skill, index) => index > currentIndex && !skill.mastered,
  );

  return next === -1 ? undefined : next;
}
