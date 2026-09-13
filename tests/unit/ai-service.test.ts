import { beforeEach, describe, expect, it, vi } from "vitest";

vi.stubEnv("GEMINI_API_KEY", "test-gemini-key");

const validRoadmap = {
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
        overview: "Build a mental model of semantic HTML before styling interfaces.",
        keyIdeas: ["Elements describe meaning", "Semantic structure improves accessibility"],
        content: "## Semantic HTML\nUse elements according to the meaning of their content.",
        practice: "Create a semantic profile page using headings, lists, and navigation.",
      },
      prerequisites: [],
      youtubeQuery: "HTML fundamentals tutorial",
    },
  ],
};

let geminiResponse = JSON.stringify(validRoadmap);
let requestedModel = "";

vi.mock("@google/generative-ai", () => {
  class FakeGoogleGenerativeAI {
    getGenerativeModel({ model }: { model: string }) {
      requestedModel = model;

      return {
        generateContent: async () => ({
          response: {
            text: () => geminiResponse,
          },
        }),
      };
    }
  }

  return {
    GoogleGenerativeAI: FakeGoogleGenerativeAI,
  };
});

import { aiService } from "@/services/ai.service";

describe("aiService.generateRoadmap", () => {
  beforeEach(() => {
    geminiResponse = JSON.stringify(validRoadmap);
    requestedModel = "";
  });

  it("uses the low-latency Gemini model for roadmap generation", async () => {
    await aiService.generateRoadmap("Frontend Developer");

    expect(requestedModel).toBe("gemini-2.5-flash-lite");
  });

  it("generates a valid roadmap from Gemini output", async () => {
    const roadmap = await aiService.generateRoadmap("Frontend Developer");

    expect(roadmap.goal.title).toBe("Frontend Developer");
    expect(roadmap.goal.estimatedWeeks).toBe(20);
    expect(roadmap.skills).toHaveLength(1);
    expect(roadmap.skills[0].skillKey).toBe("html-fundamentals");
    expect(roadmap.skills[0].lesson.overview).toContain("mental model");
    expect(roadmap.skills[0].lesson.keyIdeas).toHaveLength(2);
  });

  it("throws AIOutputInvalidError when Gemini returns invalid JSON", async () => {
    geminiResponse = "this is not valid JSON";

    await expect(
      aiService.generateRoadmap("Frontend Developer"),
    ).rejects.toThrow("AI returned invalid JSON");
  });

  it("rejects valid JSON that does not match the roadmap schema", async () => {
    geminiResponse = JSON.stringify({
      goal: {
        title: "Frontend Developer",
        estimatedWeeks: 20,
      },
      skills: [],
    });

    await expect(
      aiService.generateRoadmap("Frontend Developer"),
    ).rejects.toThrow("AI output does not match RoadmapSchema");
  });
});
