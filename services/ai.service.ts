import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  parseMasteryEvaluation,
  parseRoadmap,
} from "@/lib/ai/parser";
import {
  MASTERY_EVALUATION_PROMPT,
  ROADMAP_PROMPT,
} from "@/lib/ai/prompts";
import type { MasteryEvaluation, Roadmap } from "@/lib/ai/schema";
import { AIOutputInvalidError } from "@/lib/errors/domain";

const MODEL_NAME = "gemini-3.5-flash-lite";

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("AI service is not configured");

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json",
    },
  });
}

async function generateJson(prompt: string) {
  const model = getModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function generateJsonWithRetry(prompt: string) {
  try {
    return await generateJson(prompt);
  } catch (error) {
    if (!(error instanceof AIOutputInvalidError)) throw error;

    const retryPrompt = `${prompt}\n\nThe previous output was invalid. Return only JSON matching the requested schema. Do not add markdown fences or commentary.`;
    return generateJson(retryPrompt);
  }
}

export const aiService = {
  async generateRoadmap(goal: string): Promise<Roadmap> {
    const raw = await generateJson(ROADMAP_PROMPT(goal));
    try {
      return parseRoadmap(raw);
    } catch (error) {
      if (!(error instanceof AIOutputInvalidError)) throw error;
      const retryRaw = await generateJsonWithRetry(ROADMAP_PROMPT(goal));
      return parseRoadmap(retryRaw);
    }
  },

  async evaluateMastery(input: {
    skillTitle: string;
    skillDescription: string;
    criteria: string[];
    practice: string;
    response: string;
  }): Promise<MasteryEvaluation> {
    const prompt = MASTERY_EVALUATION_PROMPT(input);
    const raw = await generateJson(prompt);

    try {
      return parseMasteryEvaluation(raw);
    } catch (error) {
      if (!(error instanceof AIOutputInvalidError)) throw error;
      const retryRaw = await generateJsonWithRetry(prompt);
      return parseMasteryEvaluation(retryRaw);
    }
  },
};
