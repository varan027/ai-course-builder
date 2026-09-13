import { describe, expect, it } from "vitest";
import { canAdvanceToMastery } from "@/lib/mastery-proof";

describe("mastery gate", () => {
  const passing = {
    passed: true,
    capabilities: [
      { capabilityIndex: 0, demonstrated: true },
      { capabilityIndex: 1, demonstrated: true },
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
        capabilities: [{ capabilityIndex: 0, demonstrated: true }],
      }, 2),
    ).toBe(false);
  });

  it("blocks mastery when one capability is not demonstrated", () => {
    expect(
      canAdvanceToMastery({
        ...passing,
        capabilities: [
          { capabilityIndex: 0, demonstrated: true },
          { capabilityIndex: 1, demonstrated: false },
        ],
      }, 2),
    ).toBe(false);
  });

  it("blocks duplicate capability indexes", () => {
    expect(
      canAdvanceToMastery({
        ...passing,
        capabilities: [
          { capabilityIndex: 0, demonstrated: true },
          { capabilityIndex: 0, demonstrated: true },
        ],
      }, 2),
    ).toBe(false);
  });

  it("blocks out-of-range capability indexes", () => {
    expect(
      canAdvanceToMastery({
        ...passing,
        capabilities: [
          { capabilityIndex: 0, demonstrated: true },
          { capabilityIndex: 2, demonstrated: true },
        ],
      }, 2),
    ).toBe(false);
  });

  it("blocks malformed or absent evaluations", () => {
    expect(canAdvanceToMastery(null, 1)).toBe(false);
  });
});