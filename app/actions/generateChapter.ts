"use server";

import { getAuthUser } from "@/lib/auth";
import ConnectToDB from "@/lib/db";
import CourseModel from "@/models/CourseModel";
import { getGeminiTextResponse } from "@/lib/ai";
import { searchYoutube } from "@/lib/youtube";
import { GenerateChapterContentPrompt } from "@/constants/AiPrompt";
import { revalidatePath } from "next/cache";

interface GenerateChapterProps {
  courseId: string;
  chapterIndex: number;
}

export async function generateChapter({ courseId, chapterIndex }: GenerateChapterProps) {
  try {
    const user = await getAuthUser();
    
    await ConnectToDB();

    const course = await CourseModel.findOne({
      _id: courseId,
      userId: user.id,
    });

    if (!course) {
      throw new Error("Course not found");
    }

    const chapter = course.chapters[chapterIndex];

    if (chapter.content && chapter.videoId) {
      return { success: true, chapter: JSON.parse(JSON.stringify(chapter)) };
    }

    const prompt = GenerateChapterContentPrompt(
      chapter.chapterName,
      course.topic,
      course.style || "Detailed"
    );

    const [content, videoId] = await Promise.all([
      getGeminiTextResponse(prompt),
      searchYoutube(chapter.chapterName + " " + course.topic),
    ]);

    course.chapters[chapterIndex].content = content;
    course.chapters[chapterIndex].videoId = videoId;
    
    course.markModified("chapters");
    await course.save();

    revalidatePath(`/dashboard/${courseId}`);

    return { 
      success: true, 
      chapter: JSON.parse(JSON.stringify(course.chapters[chapterIndex])) 
    };

  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, error: error.message };
  }
}