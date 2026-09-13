import { describe, expect, it, vi, beforeEach } from "vitest";
import { SkillStatus } from "@prisma/client";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  getById: vi.fn(),
  startProject: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ getCurrentUser: mocks.getCurrentUser }));
vi.mock("@/services/goal.service", () => ({ goalService: { getById: mocks.getById } }));
vi.mock("@/services/progress.service", () => ({ progressService: { startProject: mocks.startProject } }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

describe("start project action", () => {
  beforeEach(() => vi.clearAllMocks());

  it("blocks starting a project before mastery", async () => {
    mocks.getCurrentUser.mockResolvedValue({ id: "user-1" });
    mocks.getById.mockResolvedValue({
      goalSkills: [{ id: "skill-1", projectChallenge: "Build a real project", progress: [{ status: SkillStatus.PRACTICING }] }],
    });

    const { startProject } = await import("@/actions/startProject");
    const result = await startProject({ error: undefined }, new FormData());

    expect(result.error).toBe("Master the skill before starting this project.");
    expect(mocks.startProject).not.toHaveBeenCalled();
  });

  it("starts a project for a mastered skill", async () => {
    mocks.getCurrentUser.mockResolvedValue({ id: "user-1" });
    mocks.getById.mockResolvedValue({
      goalSkills: [{ id: "skill-1", projectChallenge: "Build a real project", progress: [{ status: SkillStatus.MASTERED }] }],
    });
    mocks.startProject.mockResolvedValue({ projectStartedAt: new Date() });

    const { startProject } = await import("@/actions/startProject");
    const formData = new FormData();
    formData.set("goalId", "goal-1");
    formData.set("goalSkillId", "skill-1");
    const result = await startProject({ error: undefined }, formData);

    expect(result).toEqual({});
    expect(mocks.startProject).toHaveBeenCalledWith("user-1", "skill-1");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/courses/goal-1/0");
  });
});
