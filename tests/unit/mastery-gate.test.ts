import { describe, expect, it } from "vitest";
import { canAdvanceToMastery } from "@/lib/mastery-proof";

describe("mastery gate", () => {
  const passing = {
    passed: true,
    capabilities: [
      { capability: "Explain the concept", demonstrated: true },
      { capability: "Apply the concept", demonstrated: true },
    ],
    feedback: "You demonstrated the required capabilities.",
    retryGuidance: "No retry is needed.",
  };

  it("allows mastery only when every required capability is demonstrated", () => {
    expect(canAdvanceToMastery(passing, 2)).toBe(true);
  });

  it("blocks mastery when one capability is missing", () => {
    expect(
      canAdvanceToMastery({
        ...passing,
        capabilities: [{ capability: "Explain the concept", demonstrated: true }],
      }, 2),
    ).toBe(false);
  });

  it("blocks mastery when one capability is not demonstrated", () => {
    expect(
      canAdvanceToMastery({
        ...passing,
        capabilities: [
          { capability: "Explain the concept", demonstrated: true },
          { capability: "Apply the concept", demonstrated: false },
        ],
      }, 2),
    ).toBe(false);
  });

  it("blocks malformed or absent evaluations", () => {
    expect(canAdvanceToMastery(null, 1)).toBe(false);
  });
});
