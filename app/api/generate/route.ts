import { GenerateCoursePrompt } from "@/constants/AiPrompt";
import { getGeminiResponse } from "@/lib/ai";
import { getAuthUser } from "@/lib/auth";
import ConnectToDB from "@/lib/db";
import { courseInputSchema } from "@/lib/validators/courseInput";
import CourseModel from "@/models/CourseModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectToDB();

    const user = await getAuthUser();
    const input = courseInputSchema.parse(await req.json());

    const prompt = GenerateCoursePrompt(input);
    console.log(prompt);
    const courseOutline = await getGeminiResponse(prompt);

    const course = await CourseModel.create({
      userId: user.id,
      name: courseOutline.courseName ?? "Untitled Course",
      description: courseOutline.description ?? "",
      topic: input.topic,
      level: input.level,
      duration: input.duration,
      style: input.style,
      chapters: courseOutline.chapters ?? [],
      outline: courseOutline,
    });

    return NextResponse.json({ course }, { status: 201 });

  } catch (error: any) {
    console.error("api/generate error", error)
    return NextResponse.json(
      { error: error.message === "AI_GENERATION_FAILED"
          ? "AI is temporarily unavailable. Please retry."
          : "Internal server error", },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
