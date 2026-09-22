import { beforeEach, describe, expect, it, vi } from "vitest";
import { goalService } from "@/services/goal.service";
import { aiService } from "@/services/ai.service";
import { goalRepository } from "@/lib/repositories/goal.repo";
import type { Roadmap } from "@/lib/ai/schema";

vi.mock("@/services/ai.service", () => ({
  aiService: {
    generateRoadmap: vi.fn(),
  },
}));

vi.mock("@/lib/repositories/goal.repo", () => ({
  goalRepository: {
    createGoalAggregate: vi.fn(),
    findAllByOwner: vi.fn(),
    findOwned: vi.fn(),
  },
}));

const roadmap: Roadmap = {
  goal: {
    title: "Frontend Developer",
    estimatedWeeks: 20,
  },

  skills: [
    {
      skillKey: "html-fundamentals",
      skill: {
        title: "HTML Fundamentals",
        description: "Learn the structure and semantics of web pages.",
      },
      context: {
        description: "Learn semantic HTML and document structure.",
        whyImportant: "HTML provides the foundation of every web page.",
        milestone: "Can build a semantic HTML page.",
        projectChallenge: "Build a semantic portfolio page.",
      },
      lesson: {
        overview:
          "Build a mental model of semantic HTML before styling interfaces.",
        keyIdeas: [
          "Elements describe meaning",
          "Semantic structure improves accessibility",
        ],
        content:
          "## Semantic HTML\nUse elements according to the meaning of their content.",
        practice:
          "Create a semantic profile page using headings, lists, and navigation.",
        masteryCriteria: [
          "Can explain the purpose of common semantic HTML elements.",
          "Can build a page using appropriate semantic structure.",
        ],
      },
      prerequisites: [],
      youtubeQuery: "HTML fundamentals tutorial",
    },

    {
      skillKey: "css-basics",
      skill: {
        title: "CSS Basics",
        description: "Learn how to style and layout web pages.",
      },
      context: {
        description: "Learn CSS styling and basic layouts.",
        whyImportant: "CSS controls presentation and layout.",
        milestone: "Can style a complete HTML page.",
        projectChallenge: "Style the portfolio page.",
      },
      lesson: {
        overview:
          "Build a mental model of CSS rules before creating page layouts.",
        keyIdeas: [
          "Selectors target elements",
          "Declarations define visual behavior",
        ],
        content:
          "## CSS Basics\nCSS rules connect selectors to declarations that control presentation.",
        practice:
          "Style a semantic profile page with selectors, spacing, and typography.",
        masteryCriteria: [
          "Can explain how CSS selectors and declarations work together.",
          "Can style a semantic page using selectors, spacing, and typography.",
        ],
      },
      prerequisites: ["html-fundamentals"],
      youtubeQuery: "CSS basics tutorial",
    },
  ],
};

describe("goalService.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates a roadmap and creates the goal aggregate", async () => {
    vi.mocked(aiService.generateRoadmap).mockResolvedValue(roadmap);

    vi.mocked(goalRepository.createGoalAggregate).mockResolvedValue({
      id: "goal-1",
      title: "Frontend Developer",
      estimatedWeeks: 20,
      ownerId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "READY",
    });

    const result = await goalService.create(
      "Become a frontend developer",
      "user-1",
    );

    expect(aiService.generateRoadmap).toHaveBeenCalledWith(
      "Become a frontend developer",
    );

    expect(goalRepository.createGoalAggregate).toHaveBeenCalledWith({
      ownerId: "user-1",
      title: "Frontend Developer",
      estimatedWeeks: 20,
      skills: roadmap.skills,
    });

    expect(result).toEqual({
      id: "goal-1",
      title: "Frontend Developer",
      estimatedWeeks: 20,
      ownerId: "user-1",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      status: "READY",
    });
  });

  it("does not create a goal when roadmap generation fails", async () => {
    vi.mocked(aiService.generateRoadmap).mockRejectedValue(
      new Error("AI failed"),
    );

    await expect(
      goalService.create("Become a frontend developer", "user-1"),
    ).rejects.toThrow("AI failed");

    expect(goalRepository.createGoalAggregate).not.toHaveBeenCalled();
  });

  it("propagates repository errors", async () => {
    vi.mocked(aiService.generateRoadmap).mockResolvedValue(roadmap);

    vi.mocked(goalRepository.createGoalAggregate).mockRejectedValue(
      new Error("Repository failed"),
    );

    await expect(
      goalService.create("Become a frontend developer", "user-1"),
    ).rejects.toThrow("Repository failed");
  });
});
