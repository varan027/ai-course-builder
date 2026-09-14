import { beforeEach, describe, expect, it, vi } from "vitest";
import { SkillStatus } from "@prisma/client";
import { advanceSkill } from "@/actions/advancceSkill";
import { goalService } from "@/services/goal.service";
import { progressService } from "@/services/progress.service";
import { aiService } from "@/services/ai.service";
import { AIOutputInvalidError } from "@/lib/errors/domain";

vi.mock("@/lib/auth", () => ({ getCurrentUser: vi.fn().mockResolvedValue({ id: "user-01" }) }));
vi.mock("@/services/goal.service", () => ({ goalService: { getById: vi.fn() } }));
vi.mock("@/services/progress.service", () => ({ progressService: { advanceSkill: vi.fn() } }));
vi.mock("@/services/ai.service", () => ({ aiService: { evaluateMasteryProof: vi.fn() } }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

describe("advanceSkill mastery evidence", () => {
  beforeEach(() => vi.clearAllMocks());

  const storedProof = {
    masteryProofTask: "Design a useful HTTP request and explain how the response should be handled.",
    masteryProofType: "TECHNICAL",
    masteryProofCapabilities: JSON.stringify([
      "Apply HTTP methods correctly to a realistic request.",
      "Explain the expected response behavior.",
    ]),
    masteryProofCriteria: JSON.stringify([
      "The request uses an appropriate method and the reasoning is technically sound.",
      "The response behavior is explained accurately.",
    ]),
  };

  function form() {
    const formData = new FormData();
    formData.set("goalId", "goal-01");
    formData.set("goalSkillId", "gskill-101");
    formData.set("proofAnswer", "I would use GET when retrieving a resource because the operation reads existing data without creating a new resource.");
    return formData;
  }

  function goalWithApplyingSkill() {
    return {
      goalSkills: [{
        id: "gskill-101",
        skill: { title: "HTTP", description: "HTTP fundamentals" },
        progress: [{ status: SkillStatus.APPLYING }],
        lessonOverview: "Understand HTTP requests.",
        lessonKeyIdeas: JSON.stringify(["Methods describe intent"]),
        ...storedProof,
      }],
    };
  }

  it("keeps APPLYING when evidence does not demonstrate every capability", async () => {
    vi.mocked(goalService.getById).mockResolvedValue(goalWithApplyingSkill() as never);
    vi.mocked(aiService.evaluateMasteryProof).mockResolvedValue({
      passed: false,
      capabilities: [
        { capabilityIndex: 0, demonstrated: true },
        { capabilityIndex: 1, demonstrated: false },
      ],
      feedback: "Your response needs a clearer explanation of the response behavior.",
      retryGuidance: "Explain what the client should expect after the request completes.",
    });

    const result = await advanceSkill({}, form());

    expect(result.feedback).toContain("clearer explanation");
    expect(progressService.advanceSkill).not.toHaveBeenCalled();
  });

  it("advances to mastery only after the evaluator passes all capabilities", async () => {
    vi.mocked(goalService.getById).mockResolvedValue(goalWithApplyingSkill() as never);
    vi.mocked(aiService.evaluateMasteryProof).mockResolvedValue({
      passed: true,
      capabilities: [
        { capabilityIndex: 0, demonstrated: true },
        { capabilityIndex: 1, demonstrated: true },
      ],
      feedback: "You demonstrated the required capabilities.",
      retryGuidance: "No retry is needed.",
    });

    const result = await advanceSkill({}, form());

    expect(result).toEqual({});
    expect(aiService.evaluateMasteryProof).toHaveBeenCalledOnce();
    expect(progressService.advanceSkill).toHaveBeenCalledWith("user-01", "gskill-101");
  });

  it("does not grant mastery when the skill has no stored proof", async () => {
    vi.mocked(goalService.getById).mockResolvedValue({
      goalSkills: [{ id: "gskill-101", skill: { title: "Legacy skill", description: "Legacy" }, progress: [{ status: SkillStatus.APPLYING }] }],
    } as never);

    const result = await advanceSkill({}, form());

    expect(result.error).toContain("does not have a mastery proof");
    expect(progressService.advanceSkill).not.toHaveBeenCalled();
  });

  it("fails safely when the evaluator cannot produce a valid result", async () => {
    vi.mocked(goalService.getById).mockResolvedValue(goalWithApplyingSkill() as never);
    vi.mocked(aiService.evaluateMasteryProof).mockRejectedValue(
      new AIOutputInvalidError("AI mastery evaluation returned invalid JSON"),
    );

    const result = await advanceSkill({}, form());

    expect(result.error).toContain("couldn't evaluate your evidence");
    expect(progressService.advanceSkill).not.toHaveBeenCalled();
  });
});