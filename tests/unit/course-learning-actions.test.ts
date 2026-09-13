import { describe, expect, it } from "vitest";
import { getSkillActionLabel, type ProgressStage } from "@/lib/course-learning";

describe("skill action labels", () => {
  it.each([
    ["NOT_STARTED", "Start learning"],
    ["EXPLORING", "Continue learning"],
    ["PRACTICING", "Continue practicing"],
    ["APPLYING", "Continue applying"],
    ["MASTERED", "Next skill"],
  ] as [ProgressStage, string][])('labels %s as %s', (stage, label) => {
    expect(getSkillActionLabel(stage)).toBe(label);
  });
});
