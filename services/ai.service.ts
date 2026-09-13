import { parseGeneratedRoadmap } from "@/lib/ai/parser";
import { MASTERY_EVALUATION_PROMPT, ROADMAP_PROMPT } from "@/lib/ai/prompts";
import {
  MasteryEvaluationSchema,
  type MasteryEvaluation,
  type Roadmap,
} from "@/lib/ai/schema";
import { AIOutputInvalidError } from "@/lib/errors/domain";
import { GoogleGenerativeAI } from "@google/generative-ai";

function cleanJson(text: string) {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

export const aiService = {
  async generateRoadmap(goal: string): Promise<Roadmap> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("Missing Gemini API key");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
    const result = await model.generateContent(ROADMAP_PROMPT(goal));

    return parseGeneratedRoadmap(cleanJson(result.response.text()));
  },

  async evaluateMasteryProof(input: {
    skillTitle: string;
    skillDescription: string;
    lessonOverview: string;
    keyIdeas: string[];
    proofTask: string;
    proofType: string;
    capabilities: string[];
    evaluationCriteria: string[];
    learnerEvidence: string;
  }): Promise<MasteryEvaluation> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("Missing Gemini API key");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
    const result = await model.generateContent(MASTERY_EVALUATION_PROMPT(input));

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleanJson(result.response.text()));
    } catch {
      throw new AIOutputInvalidError("AI mastery evaluation returned invalid JSON");
    }

    const evaluation = MasteryEvaluationSchema.safeParse(parsed);
    if (!evaluation.success) {
      throw new AIOutputInvalidError(
        "AI mastery evaluation does not match MasteryEvaluationSchema",
      );
    }

    return evaluation.data;
  },
};
