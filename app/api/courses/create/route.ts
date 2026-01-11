import { getAuthUser } from "@/lib/auth";
import ConnectToDB from "@/lib/db";
import { Chapter } from "@/lib/types";
import CourseModel from "@/models/CourseModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  try{
    await ConnectToDB();

    const user = await getAuthUser();

    const { course } = await req.json()

    const initialChapters = course.chapters.map((chapter: Chapter )=> ({
        chapterName: chapter.chapterName,
        about: chapter.about,
        duration: chapter.duration,
        videoId: "",
        content: "",
    }));

    const finalCourse = await CourseModel.create({
      userId: user.id,
      name: course.name,
      description: course.description,
      topic: course.topic,
      level: course.level,
      duration: course.duration,
      style: course.style,
      chapters: initialChapters,
      outline: course.outline
    })

    return NextResponse.json({ course : finalCourse }, { status : 201 })
  } catch (error: any){
    console.error("Create Course Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}