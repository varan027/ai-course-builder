import { getAuthUser } from "@/lib/auth";
import ConnectToDB from "@/lib/db";
import CourseModel from "@/models/CourseModel";
import { NextRequest, NextResponse } from "next/server";
import { searchYoutube } from "@/lib/youtube";
import { GenerateChapterContentPrompt } from "@/constants/AiPrompt";
import { getGeminiTextResponse } from "@/lib/ai";

export async function POST(req: NextRequest){
  try{
    await ConnectToDB();

    const user = await getAuthUser();

    const { course } = await req.json()

    const processedChapters = await Promise.all(
      course.chapters.map(async (chapter: any)=> {
        const videoId = await searchYoutube(`${course.topic} ${chapter.chapterName} tutorial`);

        const contentPrompt = GenerateChapterContentPrompt(chapter.chapterName, course.topic, course.style)

        const content = await getGeminiTextResponse(contentPrompt);

        return {
          ...chapter,
          videoId : videoId,
          content: content
        }
      })
    )

    const finalCourse = await CourseModel.create({
      userId: user.id,
      name: course.name,
      description: course.description,
      topic: course.topic,
      level: course.level,
      duration: course.duration,
      style: course.style,
      chapters: processedChapters,
      outline: course.outline
    })

    return NextResponse.json({ course : finalCourse }, { status : 201 })
    
  } catch (error: any){
    console.error("Create Course Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}