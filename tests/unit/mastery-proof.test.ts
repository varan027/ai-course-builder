import { describe, expect, it } from "vitest";
import {
  MasteryEvaluationSchema,
  MasteryProofSchema,
} from "@/lib/ai/schema";

describe("mastery proof contracts", () => {
  it.each(["CONCEPTUAL", "TECHNICAL", "ANALYTICAL", "PRACTICAL", "CREATIVE"])(
    "accepts the %s proof type",
    (proofType) => {
      const result = MasteryProofSchema.safeParse({
        task: "Design a concrete solution and explain why it works.",
        proofType,
        capabilities: [
          "Apply the core concept to a realistic situation.",
          "Explain the decision and expected result.",
        ],
        evaluationCriteria: [
          "Evidence demonstrates correct application.",
          "Reasoning is technically sound.",
        ],
      });

      expect(result.success).toBe(true);
    },
  );

  it("requires a learner-facing task and observable evaluation criteria", () => {
    expect(
      MasteryProofSchema.safeParse({
        task: "",
        proofType: "CONCEPTUAL",
        capabilities: [],
        evaluationCriteria: [],
      }).success,
    ).toBe(false);
  });

  it("validates structured evaluator results using capability indexes", () => {
    const result = MasteryEvaluationSchema.safeParse({
      passed: false,
      capabilities: [
        { capabilityIndex: 0, demonstrated: true },
        { capabilityIndex: 1, demonstrated: false },
      ],
      feedback: "Your explanation is clear, but the application is incomplete.",
      retryGuidance: "Try the scenario again and explain the decision you would make.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an evaluator result that invents a capability name instead of an index", () => {
    const result = MasteryEvaluationSchema.safeParse({
      passed: true,
      capabilities: [
        { capability: "Invented capability", demonstrated: true },
        { capability: "Another invented capability", demonstrated: true },
      ],
      feedback: "Everything looks good.",
      retryGuidance: "No retry is needed.",
    });

    expect(result.success).toBe(false);
  });
});
