import { describe, expect, it } from "vitest";
import {
  getProgressStageIndex,
  getNextSkillIndex,
} from "@/lib/course-learning";

describe("course learning helpers", () => {
  it("maps mastery stages to an ordered progress index", () => {
    expect(getProgressStageIndex("NOT_STARTED")).toBe(0);
    expect(getProgressStageIndex("PRACTICING")).toBe(2);
    expect(getProgressStageIndex("MASTERED")).toBe(4);
  });

  it("finds the next unmastered skill after the current skill", () => {
    expect(
      getNextSkillIndex(
        [
          { mastered: true },
          { mastered: false },
          { mastered: false },
        ],
        0,
      ),
    ).toBe(1);
  });
});
