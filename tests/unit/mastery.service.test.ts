import { beforeEach, describe, expect, it, vi } from "vitest";
import { SkillStatus } from "@prisma/client";
import { masteryService } from "@/services/mastery.service";
import { masteryRepository } from "@/lib/repositories/mastery.repo";
import { aiService } from "@/services/ai.service";

vi.mock("@/lib/repositories/mastery.repo", () => ({
  masteryRepository: {
    getSkillForEvaluation: vi.fn(),
    recordEvaluation: vi.fn(),
  },
}));

vi.mock("@/services/ai.service", () => ({
  aiService: { evaluateMastery: vi.fn() },
}));

describe("masteryService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects evidence when the skill is not in APPLYING", async () => {
    vi.mocked(masteryRepository.getSkillForEvaluation).mockResolvedValue({
      masteryCriteria: JSON.stringify(["Explain the request lifecycle", "Apply it correctly"]),
      lessonPractice: "Inspect a real request.",
      skill: { title: "HTTP", description: "HTTP fundamentals" },
      progress: [{ status: SkillStatus.PRACTICING, id: "progress-1" }],
    } as never);

    await expect(
      masteryService.submitEvidence("user-1", "skill-1", "A sufficiently long answer that explains the approach clearly."),
    ).rejects.toThrow("not ready for mastery");

    expect(aiService.evaluateMastery).not.toHaveBeenCalled();
  });

  it("records a failed evaluation without changing the status", async () => {
    vi.mocked(masteryRepository.getSkillForEvaluation).mockResolvedValue({
      masteryCriteria: JSON.stringify(["Explain the request lifecycle", "Apply it correctly"]),
      lessonPractice: "Inspect a real request.",
      skill: { title: "HTTP", description: "HTTP fundamentals" },
      progress: [{ status: SkillStatus.APPLYING, id: "progress-1" }],
    } as never);
    vi.mocked(aiService.evaluateMastery).mockResolvedValue({
      passed: false,
      score: 45,
      strengths: ["Clear terminology"],
      gaps: ["Missing practical reasoning"],
      feedback: "Explain the concrete request flow and why each step matters.",
      criteriaResults: [
        { criterion: "Explain the request lifecycle", passed: false, feedback: "Missing the lifecycle." },
        { criterion: "Apply it correctly", passed: true, feedback: "Application is partially correct." },
      ],
    });
    vi.mocked(masteryRepository.recordEvaluation).mockResolvedValue({
      evidence: { passed: false, score: 45, feedback: "Retry." },
      status: SkillStatus.APPLYING,
    } as never);

    const result = await masteryService.submitEvidence(
      "user-1",
      "skill-1",
      "I would inspect the request and then check the response status to understand what happened.",
    );

    expect(result.status).toBe(SkillStatus.APPLYING);
    expect(masteryRepository.recordEvaluation).toHaveBeenCalledWith(
      expect.objectContaining({
        skillProgressId: "progress-1",
        response: expect.any(String),
        passed: false,
      }),
    );
  });

  it("passes evaluation to the repository for atomic mastery", async () => {
    vi.mocked(masteryRepository.getSkillForEvaluation).mockResolvedValue({
      masteryCriteria: JSON.stringify(["Explain the request lifecycle", "Apply it correctly"]),
      lessonPractice: "Inspect a real request.",
      skill: { title: "HTTP", description: "HTTP fundamentals" },
      progress: [{ status: SkillStatus.APPLYING, id: "progress-1" }],
    } as never);
    vi.mocked(aiService.evaluateMastery).mockResolvedValue({
      passed: true,
      score: 90,
      strengths: ["Correct reasoning"],
      gaps: [],
      feedback: "Strong practical explanation.",
      criteriaResults: [
        { criterion: "Explain the request lifecycle", passed: true, feedback: "Correct." },
        { criterion: "Apply it correctly", passed: true, feedback: "Correct." },
      ],
    });
    vi.mocked(masteryRepository.recordEvaluation).mockResolvedValue({
      evidence: { passed: true, score: 90, feedback: "Strong practical explanation." },
      status: SkillStatus.MASTERED,
    } as never);

    const result = await masteryService.submitEvidence(
      "user-1",
      "skill-1",
      "I would inspect the request headers, follow the request lifecycle, and verify the response status before deciding what to change.",
    );

    expect(result.status).toBe(SkillStatus.MASTERED);
  });
});
