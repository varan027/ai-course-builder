import { beforeEach, expect, it, vi } from "vitest";
import { SkillStatus } from "@prisma/client";
import { progressService } from "@/services/progress.service";
import { progressRepository } from "@/lib/repositories/progress.repo";
import { arePrerequisitesSatisfied, getNextSkillStatus } from "@/lib/domain/progress-state";

type PrerequisiteProgress = NonNullable<
  Awaited<ReturnType<typeof progressRepository.getPrerequisiteProgress>>
>;

beforeEach(() => {
  vi.clearAllMocks();
});

vi.mock("@/lib/repositories/progress.repo", () => ({
  progressRepository: {
    getPrerequisiteProgress: vi.fn(),
    getSkillProgress: vi.fn(),
    createSkillProgress: vi.fn(),
    updateSkillProgress: vi.fn(),
    startProject: vi.fn(),
    getProgressForGoal: vi.fn(),
  },
}));

vi.mock("@/lib/domain/progress-state", () => ({
  arePrerequisitesSatisfied: vi.fn(),
  getNextSkillStatus: vi.fn(),
}));

const existing = {
  id: "skillprogress-01",
  status: SkillStatus.EXPLORING,
  updatedAt: new Date(),
  userId: "user-01",
  goalSkillId: "gskill-101",
  projectStartedAt: null,
  completedAt: null,
};

const createdProgress = {
  id: "progress-01",
  status: SkillStatus.EXPLORING,
  userId: "user-01",
  goalSkillId: "gskill-101",
  projectStartedAt: null,
  updatedAt: new Date(),
  completedAt: null,
};

const prerequisitesProgress: PrerequisiteProgress = {
  id: "gskill-101",
  goalId: "goal-abc",
  skillId: "skill-git-basics",
  position: 1,
  description: "Learn fundamental version control using Git.",
  whyImportant: "Crucial for backing up work and collaborating with other developers.",
  milestone: "Initialize a local repository and push it to a remote host.",
  projectChallenge: "Resolve a complex merge conflict between two local branches manually.",
  lessonOverview: null,
  lessonKeyIdeas: null,
  lessonContent: null,
  lessonPractice: null,
  masteryCriteria: null,
  dependencies: [],
};

function withDependencies(
  dependencies: PrerequisiteProgress["dependencies"],
): PrerequisiteProgress {
  return {
    ...prerequisitesProgress,
    dependencies,
  };
}

function prerequisiteGoalSkill(status: SkillStatus | undefined) {
  return {
    id: "gskill-100",
    goalId: "goal-abc",
    skillId: "skill-html",
    position: 0,
    description: "Learn HTML",
    whyImportant: "Foundation",
    milestone: "Build a page",
    projectChallenge: "Build a website",
    lessonOverview: null,
    lessonKeyIdeas: null,
    lessonContent: null,
    lessonPractice: null,
    masteryCriteria: null,
    progress: status
      ? [{
          id: "skillprogress-prerequisite",
          status,
          updatedAt: new Date(),
          userId: "user-01",
          goalSkillId: "gskill-100",
          projectStartedAt: null,
          completedAt: null,
        }]
      : [],
  };
}

it("allows a skill with no prerequisites to start", async () => {
  vi.mocked(progressRepository.getSkillProgress).mockResolvedValue(null);
  vi.mocked(progressRepository.getPrerequisiteProgress).mockResolvedValue(prerequisitesProgress);
  vi.mocked(arePrerequisitesSatisfied).mockReturnValue(true);
  vi.mocked(progressRepository.createSkillProgress).mockResolvedValue(createdProgress);

  const result = await progressService.advanceSkill("user-01", "gskill-101");

  expect(result).toEqual(createdProgress);
  expect(progressRepository.createSkillProgress).toHaveBeenCalledWith("user-01", "gskill-101");
  expect(arePrerequisitesSatisfied).toHaveBeenCalledWith([]);
});

it("does not allow a skill to advance when a prerequisite is not mastered", async () => {
  vi.mocked(progressRepository.getSkillProgress).mockResolvedValue(existing);
  vi.mocked(progressRepository.getPrerequisiteProgress).mockResolvedValue(
    withDependencies([
      {
        id: "dependency-1",
        goalSkillId: "gskill-101",
        prerequisiteGoalSkillId: "gskill-100",
        prerequisiteGoalSkill: prerequisiteGoalSkill(undefined),
      },
    ]),
  );
  vi.mocked(arePrerequisitesSatisfied).mockReturnValue(false);

  await expect(progressService.advanceSkill("user-01", "gskill-101")).rejects.toThrowError(
    "Prerequisites are not satisfied",
  );

  expect(arePrerequisitesSatisfied).toHaveBeenCalledWith([SkillStatus.NOT_STARTED]);
  expect(progressRepository.updateSkillProgress).not.toHaveBeenCalled();
});

it("allows an existing skill to advance when all prerequisites are mastered", async () => {
  vi.mocked(progressRepository.getSkillProgress).mockResolvedValue(existing);
  vi.mocked(progressRepository.getPrerequisiteProgress).mockResolvedValue(
    withDependencies([
      {
        id: "dependency-1",
        goalSkillId: "gskill-101",
        prerequisiteGoalSkillId: "gskill-100",
        prerequisiteGoalSkill: prerequisiteGoalSkill(SkillStatus.MASTERED),
      },
    ]),
  );
  vi.mocked(arePrerequisitesSatisfied).mockReturnValue(true);
  vi.mocked(getNextSkillStatus).mockReturnValue(SkillStatus.PRACTICING);
  vi.mocked(progressRepository.updateSkillProgress).mockResolvedValue({
    ...existing,
    status: SkillStatus.PRACTICING,
  });

  const result = await progressService.advanceSkill("user-01", "gskill-101");

  expect(result.status).toBe(SkillStatus.PRACTICING);
  expect(getNextSkillStatus).toHaveBeenCalledWith(SkillStatus.EXPLORING);
  expect(progressRepository.updateSkillProgress).toHaveBeenCalledWith(
    existing.id,
    SkillStatus.PRACTICING,
  );
});

it("does not allow progress action to bypass mastery evaluation", async () => {
  vi.mocked(progressRepository.getSkillProgress).mockResolvedValue({
    ...existing,
    status: SkillStatus.APPLYING,
  });

  await expect(progressService.advanceSkill("user-01", "gskill-101")).rejects.toThrow(
    "Submit mastery evidence before completing this skill",
  );

  expect(progressRepository.getPrerequisiteProgress).not.toHaveBeenCalled();
  expect(progressRepository.updateSkillProgress).not.toHaveBeenCalled();
});

it("does not advance an already mastered skill", async () => {
  const mastered = { ...existing, status: SkillStatus.MASTERED };
  vi.mocked(progressRepository.getSkillProgress).mockResolvedValue(mastered);

  const result = await progressService.advanceSkill("user-01", "gskill-101");

  expect(result).toEqual(mastered);
  expect(progressRepository.getPrerequisiteProgress).not.toHaveBeenCalled();
  expect(progressRepository.updateSkillProgress).not.toHaveBeenCalled();
});
