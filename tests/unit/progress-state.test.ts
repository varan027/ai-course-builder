import { describe, expect, it } from "vitest";
import { SkillStatus } from "@prisma/client";
import {
  canAdvanceSkill,
  getNextSkillStatus,
} from "../../lib/domain/progress-state";

describe("skill progress state machine", () => {
  it.each([
    [SkillStatus.NOT_STARTED, SkillStatus.EXPLORING],
    [SkillStatus.EXPLORING, SkillStatus.PRACTICING],
    [SkillStatus.PRACTICING, SkillStatus.APPLYING],
    [SkillStatus.APPLYING, SkillStatus.MASTERED],
  ])("advances %s to %s", (current, expected) => {
    expect(getNextSkillStatus(current)).toBe(expected);
  });

  it("does not allow advancing a mastered skill", () => {
    expect(canAdvanceSkill(SkillStatus.MASTERED)).toBe(false);

    expect(() =>
      getNextSkillStatus(SkillStatus.MASTERED)
    ).toThrow("Skill is already mastered");
  });

  it.each([
    SkillStatus.NOT_STARTED,
    SkillStatus.EXPLORING,
    SkillStatus.PRACTICING,
    SkillStatus.APPLYING,
  ])("allows advancement from %s", (status) => {
    expect(canAdvanceSkill(status)).toBe(true);
  });
});