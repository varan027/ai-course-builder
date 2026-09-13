import { describe, expect, it } from "vitest";
import { canAdvanceToMastery } from "@/lib/mastery-proof";

describe("mastery gate", () => {
  it("allows mastery only when proof passes", () => {
    expect(canAdvanceToMastery(true)).toBe(true);
  });

  it("blocks mastery when proof fails", () => {
    expect(canAdvanceToMastery(false)).toBe(false);
  });
});
