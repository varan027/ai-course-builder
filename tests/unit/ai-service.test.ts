import { beforeEach, describe, expect, it, vi } from "vitest";

vi.stubEnv("GEMINI_API_KEY", "test-gemini-key");

const validRoadmap = {
  goal: { title: "Frontend Developer", estimatedWeeks: 20 },
  skills: [
    {
      skillKey: "html-fundamentals",
      skill: { title: "HTML Fundamentals", description: "Learn the structure and semantics of web pages." },
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
      masteryProof: {
        task: "Design a semantic page structure for a profile and explain your choices.",
        proofType: "CONCEPTUAL",
        capabilities: [
          "Choose semantic elements based on the meaning of content.",
          "Explain how the chosen structure supports accessibility.",
        ],
        evaluationCriteria: [
          "The explanation connects element choices to content meaning.",
          "The structure and accessibility reasoning are technically sound.",
        ],
      },
      prerequisites: [],
      youtubeQuery: "HTML fundamentals tutorial",
    },
  ],
};

const passingEvaluation = {
  passed: true,
  capabilities: [
    { capabilityIndex: 0, demonstrated: true },
    { capabilityIndex: 1, demonstrated: true },
  ],
  feedback: "You demonstrated the required capabilities.",
  retryGuidance: "Continue applying the same reasoning in another page structure.",
};

let geminiResponses: string[] = [];
let requestedModels: string[] = [];

vi.mock("@google/generative-ai", () => {
  class FakeGoogleGenerativeAI {
    getGenerativeModel({ model }: { model: string }) {
      requestedModels.push(model);
      return {
        generateContent: async () => ({ response: { text: () => geminiResponses.shift() ?? "{}" } }),
      };
    }
  }
  return { GoogleGenerativeAI: FakeGoogleGenerativeAI };
});

import { aiService } from "@/services/ai.service";

describe("aiService mastery evidence", () => {
  beforeEach(() => {
    geminiResponses = [JSON.stringify(validRoadmap), JSON.stringify(passingEvaluation)];
    requestedModels = [];
  });

  it("requires a mastery proof in newly generated roadmaps", async () => {
    const roadmap = await aiService.generateRoadmap("Frontend Developer");
    expect(roadmap.skills[0].masteryProof?.task).toContain("semantic page");
    expect(roadmap.skills[0].masteryProof?.capabilities).toHaveLength(2);
  });

  it("evaluates learner evidence into a structured result", async () => {
    geminiResponses = [JSON.stringify(passingEvaluation)];

    const evaluation = await aiService.evaluateMasteryProof({
      skillTitle: "HTML Fundamentals",
      skillDescription: "Learn semantic HTML.",
      lessonOverview: "Semantic HTML gives content meaningful structure.",
      keyIdeas: ["Use elements by meaning"],
      proofTask: "Design a semantic page structure.",
      proofType: "CONCEPTUAL",
      capabilities: ["Choose semantic elements", "Explain accessibility implications"],
      evaluationCriteria: ["Element choices are justified by meaning.", "Accessibility reasoning is technically sound."],
      learnerEvidence: "I would use a main element for the primary content and navigation for site navigation because their roles differ.",
    });

    expect(evaluation.passed).toBe(true);
    expect(evaluation.capabilities[0].capabilityIndex).toBe(0);
    expect(requestedModels).toEqual(["gemini-3.5-flash-lite"]);
  });

  it("rejects malformed evaluator output", async () => {
    geminiResponses = ["not valid json"];
    await expect(
      aiService.evaluateMasteryProof({
        skillTitle: "HTML Fundamentals",
        skillDescription: "Learn semantic HTML.",
        lessonOverview: "Semantic HTML gives content meaningful structure.",
        keyIdeas: ["Use elements by meaning"],
        proofTask: "Design a semantic page structure.",
        proofType: "CONCEPTUAL",
        capabilities: ["Choose semantic elements", "Explain accessibility implications"],
        evaluationCriteria: ["Element choices are justified by meaning.", "Accessibility reasoning is technically sound."],
        learnerEvidence: "I would use semantic elements based on the role of each piece of content.",
      }),
    ).rejects.toThrow("AI mastery evaluation returned invalid JSON");
  });
});