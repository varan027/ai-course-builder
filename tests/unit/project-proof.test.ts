import { describe, expect, it } from "vitest";
import { getProjectProofState } from "@/lib/project-proof";

describe("project proof", () => {
  it("locks project proof until the skill is mastered", () => {
    expect(getProjectProofState("PRACTICING", false, false, false)).toBe("LOCKED");
  });

  it("makes the project ready after mastery", () => {
    expect(getProjectProofState("MASTERED", false, false, false)).toBe("READY");
  });

  it("marks a started project as in progress", () => {
    expect(getProjectProofState("MASTERED", true, false, false)).toBe("IN_PROGRESS");
  });

  it("marks a project as evidence submitted after evidence is persisted", () => {
    expect(getProjectProofState("MASTERED", true, true, false)).toBe("EVIDENCE_SUBMITTED");
  });

  it("marks a project completed after evidence is submitted and completion is persisted", () => {
    expect(getProjectProofState("MASTERED", true, true, true)).toBe("COMPLETED");
  });

  it("does not treat completion as valid without submitted evidence", () => {
    expect(getProjectProofState("MASTERED", true, false, true)).toBe("IN_PROGRESS");
  });
});
