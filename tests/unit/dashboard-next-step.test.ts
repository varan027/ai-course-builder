import { describe, expect, it } from "vitest";
import { getNextLearningSkill, type DashboardSkill } from "@/lib/dashboard-next-step";

describe("dashboard next learning step", () => {
  it("selects the first unmastered skill", () => {
    const skills: DashboardSkill[] = [
      { mastered: true, skill: { title: "Foundations" } },
      { mastered: false, skill: { title: "Python Fundamentals" } },
      { mastered: false, skill: { title: "APIs" } },
    ];

    expect(getNextLearningSkill(skills)?.skill.title).toBe("Python Fundamentals");
  });

  it("returns undefined when every skill is mastered", () => {
    const skills: DashboardSkill[] = [
      { mastered: true, skill: { title: "Foundations" } },
      { mastered: true, skill: { title: "APIs" } },
    ];

    expect(getNextLearningSkill(skills)).toBeUndefined();
  });
});
