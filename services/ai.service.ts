import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;

const genAI = new GoogleGenerativeAI(apiKey);

export type CourseOutline = {
  title: string;
  modules: Modules[];
};

export type Modules = {
  name: string;
  lessons: {
    title: string;
    youtubeQuery: string;
  }[];
};

export const aiService = {
  async generateCourseOutline(
    topic: string,
    level: string
  ): Promise<CourseOutline> {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
      Create a structured learning course.

      Topic: ${topic}
      Level: ${level}

      Rules:
      - Output ONLY valid JSON
      - No markdown
      - No explanations
      - The goal is to help learners study using free YouTube content

      Structure:
      {
        "title": string,
        "modules": [
          {
            "name": string,
            "lessons": [
              {
                "title": string,
                "youtubeQuery": string
              }
            ]
          }
        ]
      }

      Guidelines:
      - Generate 4–6 modules
      - Each module has 3–5 lessons
      - youtubeQuery should be a natural YouTube search query
      - Queries should include "explained", "tutorial", or "for beginners" when appropriate
      `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  },
};
