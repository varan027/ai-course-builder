import { advanceSkill } from "@/actions/advancceSkill";
import { progressService } from "@/services/progress.service";
import { goalService } from "@/services/goal.service";
import { expect, it, vi } from "vitest";
import { PrerequisitesNotSatisfiedError } from "@/lib/errors/domain";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { SkillStatus } from "@prisma/client";

function createFormData() {
  const formData = new FormData();

  formData.set("goalId", "goal-abc");
  formData.set("goalSkillId", "gskill-101");

  return formData;
}

function createGoalSkill() {
  return {
    id: "gskill-101",
    skill: { title: "Test skill" },
    description: "Learn the test skill.",
    whyImportant: "It matters for the test.",
    milestone: "Can demonstrate the test skill.",
    projectChallenge: "Build a small test project.",
    lessonOverview: null,
    lessonKeyIdeas: null,
    lessonContent: null,
    lessonPractice: null,
    masteryProofTask: null,
    masteryProofType: null,
    masteryProofCapabilities: null,
    masteryProofCriteria: null,
    progress: [],
  };
}

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/services/goal.service", () => ({
  goalService: {
    getById: vi.fn(),
  },
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

  vi.mocked(goalService.getById).mockResolvedValue({
    goalSkills: [createGoalSkill()],
  } as never);

  vi.mocked(progressService.advanceSkill).mockRejectedValue(
    new PrerequisitesNotSatisfiedError(),
  );

  const result = await advanceSkill({}, createFormData());

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

  vi.mocked(goalService.getById).mockResolvedValue({
    goalSkills: [createGoalSkill()],
  } as never);

  vi.mocked(progressService.advanceSkill).mockResolvedValue({
    id: "skillprogress-01",
    status: SkillStatus.EXPLORING,
    updatedAt: new Date(),
    userId: "user-01",
    goalSkillId: "gskill-101",
    completedAt: new Date(),
  });

  await advanceSkill({}, createFormData());

  expect(progressService.advanceSkill).toHaveBeenCalledWith(
    "user-01",
    "gskill-101",
  );

  expect(revalidatePath).toHaveBeenCalledWith("/courses/goal-abc");
});
