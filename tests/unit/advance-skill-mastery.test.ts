import { beforeEach, describe, expect, it, vi } from "vitest";
import { advanceSkill } from "@/actions/advancceSkill";
import { progressService } from "@/services/progress.service";
import { SkillNotReadyForMasteryError } from "@/lib/errors/domain";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn().mockResolvedValue({ id: "user-01" }),
}));

vi.mock("@/services/progress.service", () => ({
  progressService: { advanceSkill: vi.fn() },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("advanceSkill mastery boundary", () => {
  beforeEach(() => vi.clearAllMocks());

  it("does not bypass mastery evaluation", async () => {
    vi.mocked(progressService.advanceSkill).mockRejectedValue(
      new SkillNotReadyForMasteryError(
        "Submit mastery evidence before completing this skill.",
      ),
    );

    const formData = new FormData();
    formData.set("goalId", "goal-01");
    formData.set("goalSkillId", "gskill-101");
    formData.set("chapterId", "2");

    const result = await advanceSkill({}, formData);

    expect(result).toEqual({
      error: "Submit mastery evidence before completing this skill.",
    });
  });

  it("delegates ordinary progress changes to the progress service", async () => {
    vi.mocked(progressService.advanceSkill).mockResolvedValue({} as never);

    const formData = new FormData();
    formData.set("goalId", "goal-01");
    formData.set("goalSkillId", "gskill-101");
    formData.set("chapterId", "2");

    const result = await advanceSkill({}, formData);

    expect(result).toEqual({});
    expect(progressService.advanceSkill).toHaveBeenCalledWith(
      "user-01",
      "gskill-101",
    );
  });
});
