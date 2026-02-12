import { CreateCourseInput } from "@/actions/createCourse.schema";
import { parseCourseOutline } from "@/lib/ai/parser";
import { COURSE_OUTLINE_PROMPT } from "@/lib/ai/prompts";
import { CourseOutline } from "@/lib/ai/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing Gemini API key");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const aiService = {
  async generateCourseOutline(
    input: CreateCourseInput,
  ): Promise<CourseOutline> {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      COURSE_OUTLINE_PROMPT({
        topic: input.topic,
        level: input.level,
        chapters: input.chapters,
        duration: input.duration,
      }),
    );
    const text = result.response.text();

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return parseCourseOutline(cleaned);
  },
};
