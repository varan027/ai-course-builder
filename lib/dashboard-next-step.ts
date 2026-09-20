export type DashboardSkill = {
  mastered: boolean;
  skill: {
    title: string;
  };
};

export function getNextLearningSkill<T extends DashboardSkill>(
  skills: T[],
): T | undefined {
  return skills.find((skill) => !skill.mastered);
}
