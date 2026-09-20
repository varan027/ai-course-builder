import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseMasteryEvaluation, parseRoadmap } from "@/lib/ai/parser";
import { MASTERY_EVALUATION_PROMPT, ROADMAP_PROMPT } from "@/lib/ai/prompts";
import type { MasteryEvaluation, Roadmap } from "@/lib/ai/schema";
import { AIOutputInvalidError } from "@/lib/errors/domain";

const MODEL_NAME = "gemini-3.5-flash-lite";

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("AI service is not configured");

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: { responseMimeType: "application/json" },
  });
}

async function generateJson(prompt: string) {
  const result = await getModel().generateContent(prompt);
  return result.response.text();
}

async function generateAndParse<T>(
  prompt: string,
  parser: (raw: string) => T,
): Promise<T> {
  const firstRaw = await generateJson(prompt);

  try {
    return parser(firstRaw);
  } catch (error) {
    if (!(error instanceof AIOutputInvalidError)) throw error;

    const retryRaw = await generateJson(
      `${prompt}\n\nYour previous response was invalid. Return ONLY JSON that exactly matches the requested schema. Do not add markdown fences or commentary.`,
    );

    return parser(retryRaw);
  }
}

export const aiService = {
  generateRoadmap(goal: string): Promise<Roadmap> {
    return generateAndParse(ROADMAP_PROMPT(goal), parseRoadmap);
  },

  evaluateMastery(input: {
    skillTitle: string;
    skillDescription: string;
    criteria: string[];
    practice: string;
    response: string;
  }): Promise<MasteryEvaluation> {
    return generateAndParse(
      MASTERY_EVALUATION_PROMPT(input),
      parseMasteryEvaluation,
    );
  },
};
