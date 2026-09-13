import { describe, expect, it } from "vitest";
import { getProjectProofState } from "@/lib/project-proof";

describe("project proof", () => {
  it("locks project proof until the skill is mastered", () => {
    expect(getProjectProofState("PRACTICING", false)).toBe("LOCKED");
  });

  it("makes the project ready after mastery", () => {
    expect(getProjectProofState("MASTERED", false)).toBe("READY");
  });

  it("marks a started project as in progress", () => {
    expect(getProjectProofState("MASTERED", true)).toBe("IN_PROGRESS");
  });
});
