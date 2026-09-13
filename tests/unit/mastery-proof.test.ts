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
        capabilities: ["Apply the core concept to a realistic situation."],
        evaluationCriteria: ["Evidence demonstrates correct application."],
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

  it("validates structured evaluator results", () => {
    const result = MasteryEvaluationSchema.safeParse({
      passed: false,
      capabilities: [
        { capability: "Explain the concept", demonstrated: true },
        { capability: "Apply the concept", demonstrated: false },
      ],
      feedback: "Your explanation is clear, but the application is incomplete.",
      retryGuidance: "Try the scenario again and explain the decision you would make.",
    });

    expect(result.success).toBe(true);
  });
});
