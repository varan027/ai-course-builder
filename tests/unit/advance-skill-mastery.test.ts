import { beforeEach, describe, expect, it, vi } from "vitest";
import { SkillStatus } from "@prisma/client";
import { advanceSkill } from "@/actions/advancceSkill";
import { goalService } from "@/services/goal.service";
import { progressService } from "@/services/progress.service";
import { evaluateMasteryProof, canAdvanceToMastery } from "@/lib/mastery-proof";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn().mockResolvedValue({ id: "user-01" }),
}));

vi.mock("@/services/goal.service", () => ({
  goalService: { getById: vi.fn() },
}));

vi.mock("@/services/progress.service", () => ({
  progressService: { advanceSkill: vi.fn() },
}));

vi.mock("@/lib/mastery-proof", () => ({
  evaluateMasteryProof: vi.fn(),
  canAdvanceToMastery: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("advanceSkill mastery proof", () => {
  beforeEach(() => vi.clearAllMocks());

  it("blocks mastery when proof fails", async () => {
    vi.mocked(goalService.getById).mockResolvedValue({
      goalSkills: [
        {
          id: "gskill-101",
          progress: [{ status: SkillStatus.APPLYING }],
          lessonKeyIdeas: JSON.stringify(["Use request headers", "Check response status"]),
          lessonPractice: "Construct and inspect an HTTP request.",
        },
      ],
    } as never);
    vi.mocked(evaluateMasteryProof).mockReturnValue(false);
    vi.mocked(canAdvanceToMastery).mockReturnValue(false);

    const result = await advanceSkill(
      {},
      new FormData(),
    );

    expect(result.error).toBe("Prove your understanding before marking this skill mastered.");
    expect(progressService.advanceSkill).not.toHaveBeenCalled();
  });

  it("allows mastery when proof passes", async () => {
    vi.mocked(goalService.getById).mockResolvedValue({
      goalSkills: [
        {
          id: "gskill-101",
          progress: [{ status: SkillStatus.APPLYING }],
          lessonKeyIdeas: JSON.stringify(["Use request headers", "Check response status"]),
          lessonPractice: "Construct and inspect an HTTP request.",
        },
      ],
    } as never);
    vi.mocked(evaluateMasteryProof).mockReturnValue(true);
    vi.mocked(canAdvanceToMastery).mockReturnValue(true);

    const formData = new FormData();
    formData.set("goalId", "goal-01");
    formData.set("goalSkillId", "gskill-101");
    formData.set("proofAnswer", "I would inspect the request headers and verify the response status.");

    const result = await advanceSkill({}, formData);

    expect(result).toEqual({});
    expect(progressService.advanceSkill).toHaveBeenCalledWith("user-01", "gskill-101");
  });
});
