import { parseRoadmap } from "@/lib/ai/parser";
import { ROADMAP_PROMPT } from "@/lib/ai/prompts";
import { Roadmap } from "@/lib/ai/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing Gemini API key");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const aiService = {
  async generateRoadmap(goal: string): Promise<Roadmap> {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      ROADMAP_PROMPT(goal)
    );

    const text = result.response.text();

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return parseRoadmap(cleaned);
  },
};