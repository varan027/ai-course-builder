import { GoogleGenAI } from "@google/genai";
import { CourseOutline } from "./types";

export async function getGeminiResponse(inputText: string): Promise<CourseOutline> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Server Error: GEMINI_API_KEY is not configured.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const modelConfig = {
    model: "gemini-flash-latest",
    contents: [{ role: "user", parts: [{ text: inputText }] }],
    tools: [{ googleSearch: {} }],
  };

    const response = await ai.models.generateContentStream(modelConfig);

    let responseChunks = "";
    for await (const chunk of response) {
      if (chunk.text) {
        responseChunks += chunk.text;
      }
    }

    return JSON.parse(responseChunks.replace(/```json|```/g, "").trim());
}