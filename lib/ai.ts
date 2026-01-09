import { GoogleGenAI } from "@google/genai";
import { CourseOutline } from "./types";

const apiKey = process.env.GEMINI_API_KEY;
if(!apiKey){
  console.error("Error: NO API KEY")
}

export async function getGeminiResponse(inputText: string){
  try {
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
  } catch (error: any) {
    console.error("🔥 GEMINI ERROR:", error?.message || error);
    throw new Error("AI_GENERATION_FAILED");
  }
}

export async function getGeminiTextResponse(prompt: string) {
  
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest", 
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  return response.text || "";
}
