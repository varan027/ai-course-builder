import { describe, expect, it } from "vitest";
import { canAdvanceToMastery } from "@/lib/mastery-proof";

describe("mastery gate", () => {
  it("allows mastery only when every required capability is demonstrated", () => {
    expect(
      canAdvanceToMastery({
        passed: true,
        capabilities: [
          { capability: "Explain the concept", demonstrated: true },
          { capability: "Apply the concept", demonstrated: true },
        ],
        feedback: "You demonstrated the required capabilities.",
        retryGuidance: "No retry is needed.",
      }),
    ).toBe(true);
  });

  it("blocks mastery when one capability is missing", () => {
    expect(
      canAdvanceToMastery({
        passed: true,
        capabilities: [
          { capability: "Explain the concept", demonstrated: true },
          { capability: "Apply the concept", demonstrated: false },
        ],
        feedback: "The application is incomplete.",
        retryGuidance: "Apply the concept to the scenario again.",
      }),
    ).toBe(false);
  });

  it("blocks malformed or absent evaluations", () => {
    expect(canAdvanceToMastery(null)).toBe(false);
  });
});
