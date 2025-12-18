import ConnectToDB from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import CourseModel from "@/models/CourseModel";
import { GenerateCoursePrompt } from "@/constants/AiPrompt";

async function getGeminiResponse(inputText: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Server Error: GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const contents = [{ role: "user", parts: [{ text: inputText }] }];

  const modelConfig = {
    model: "gemini-flash-latest",
    contents,
    tools: [{ googleSearch: {} }],
  };

  try {
    const response = await ai.models.generateContentStream(modelConfig);

    const responseChunks: string[] = [];
    for await (const chunk of response) {
      if (chunk.text) {
        responseChunks.push(chunk.text);
      }
    }

    const finalText = responseChunks.join("");

    if (finalText.length === 0) {
      console.error(
        "[DEBUG] Gemini returned an empty response after streaming."
      );
      throw new Error("Gemini stream completed but returned zero content.");
    }

    return finalText;
  } catch (error) {
    console.error("[DEBUG] Error during Gemini Stream/API Call:", error);
    throw new Error(
      `Gemini Stream Failed: ${
        error instanceof Error ? error.message : "Unknown stream error."
      }`
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ConnectToDB();

    const userInput = await req.json();
    const {topic, level, duration, style, chapters} = userInput;

    console.log("user input recieved", {topic, level, duration, style, chapters});
    

    if (!topic || !userInput) {
      return NextResponse.json(
        { message: "Missing prompt in request body." },
        { status: 400 }
      );
    }
    const FINAL_PROMPT = GenerateCoursePrompt(userInput)

    console.log("prompting to get ai response", FINAL_PROMPT)

    const responseText = await getGeminiResponse(FINAL_PROMPT);
    const cleanedText = responseText
    .replace(/```json/g, "")  // Remove start
    .replace(/```/g, "")      // Remove end
    .replace(/^\s+|\s+$/g, "") // Trim whitespace
    .trim();
    try {
      const CourseData = JSON.parse(cleanedText);

      console.log("--- DEBUG: AI RESPONSE KEYS ---");
      console.log(Object.keys(CourseData)); // See what keys exist
      console.log(CourseData); // See the full object

      const newCourse = await CourseModel.create({
        courseId: Math.random().toString(36).substring(2, 9),
        name: CourseData.courseName || CourseData.name || CourseData.title || "Untitled Course",
        description: CourseData.description || CourseData.summary || "No description provided",
        chapters: CourseData.chapters || [],
        topic: topic,
        level: level,
        duration: duration,
        style: style,
        outline: CourseData,
      });
      console.log(`Course Saved with ID: ${newCourse._id}`);

      return NextResponse.json({ result: newCourse }, { status: 200 });
    } catch (dberror) {
      console.error("Database Error", dberror);
      return NextResponse.json(
        {
          error: "Generated Content saved, but DB operation failed",
          message: (dberror as Error).message,
        },
        { status: 500 });
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown server error occurred.";

    console.error("API Route 500 Error:", errorMessage);

    return NextResponse.json(
      {
        error: "Failed to generate content.",
        message: `Server failed to process API request: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
