// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import { GoogleGenAI } from "@google/genai";
export async function GeminiResponse(inputText: string): Promise<string> {

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });
  const tools = [
    {
      googleSearch: {},
    },
  ];
  const config = {
    // thinkingConfig: {
    //   thinkingBudget: -1,
    // },
    tools,
  };
  const model = "gemini-flash-latest";
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: inputText,
        },
      ],
    },
  ];
  try{
    const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let finalText = "";
  for await (const chunk of response) {
    if (chunk.text) {
      finalText += chunk.text;
    }
  }
  return finalText;
  }catch (error) {
    console.error("Error generating content from Gemini:", error);
    // Re-throw or return a user-friendly message
    return "An error occurred while fetching the response.";
  }
  
}
