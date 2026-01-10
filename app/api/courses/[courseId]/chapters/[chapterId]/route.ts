import { GenerateChapterContentPrompt } from "@/constants/AiPrompt";
import { getGeminiTextResponse } from "@/lib/ai";
import ConnectToDB from "@/lib/db";
import { searchYoutube } from "@/lib/youtube";
import CourseModel from "@/models/CourseModel";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params } : { params: Promise<{ courseId: string; chapterId: string }> } ){
  try{
    const { courseId } = await params;
    const { chapterIndex } = await req.json();

    await ConnectToDB();

    const course = await CourseModel.findById(courseId);
    if(!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })

    const chapter = course.chapters[chapterIndex];

    if (chapter.content && chapter.videoId) {
      return NextResponse.json({ chapter });
    }

    const videoId = await searchYoutube(`${course.topic} ${chapter.chapterName} tutorial`);
    const contentPrompt = GenerateChapterContentPrompt(chapter.chapterName, course.topic, course.style);
    const content = await getGeminiTextResponse(contentPrompt);

    course.chapters[chapterIndex].videoId = videoId;
    course.chapters[chapterIndex].content = content;
    await course.save();

    return NextResponse.json({ chapter: course.chapters[chapterIndex] });
  } catch (error: any) {
    console.error("Chapter Generation Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}