import { advanceSkill } from "@/actions/advancceSkill";
import { progressService } from "@/services/progress.service";
import { expect, it, vi } from "vitest";
import { PrerequisitesNotSatisfiedError } from "@/lib/errors/domain";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { SkillStatus } from "@prisma/client";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/services/progress.service", () => ({
  progressService: {
    advanceSkill: vi.fn(),
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

it("should throw an error if prerequisites are not satisfied", async () => {
  vi.mocked(getCurrentUser).mockResolvedValue({
    id: "user-01",
    email: "test@example.com",
    password: "hashed-password",
    createdAt: new Date(),
  });

  vi.mocked(progressService.advanceSkill).mockRejectedValue(
    new PrerequisitesNotSatisfiedError(),
  );

  const result = await advanceSkill("goal-abc", "gskill-101");

  expect(result).toEqual({
    error: "You need to complete the prerequisite skills first.",
  });
});

it("should revalidate the path after successfully advancing a skill", async () => {
  vi.mocked(getCurrentUser).mockResolvedValue({
    id: "user-01",
    email: "test@example.com",
    password: "hashed-password",
    createdAt: new Date(),
  });

  vi.mocked(progressService.advanceSkill).mockResolvedValue({
    id: "skillprogress-01",
    status: SkillStatus.EXPLORING,
    updatedAt: new Date(),
    userId: "user-01",
    goalSkillId: "gskill-101",
    completedAt: new Date(),
  });

  await advanceSkill("goal-abc", "gskill-101");

  expect(progressService.advanceSkill).toHaveBeenCalledWith(
  "user-01",
  "gskill-101",
);

  expect(revalidatePath).toHaveBeenCalledWith("/courses/goal-abc");
});
