"use client";

import { useContext } from "react";
import { useParams, redirect } from "next/navigation";
import { CourseContext } from "../courseContext";

export default function ChapterPage() {
  const course = useContext(CourseContext);
  const params = useParams();

  if (!course) {
    redirect("/dashboard");
  }

  const chapterIndex = Number(params.chapterId);
  const chapter = course.outline.chapters[chapterIndex];

  if (!chapter) {
    redirect(`/courses/${course.id}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">
        {chapter.title}
      </h1>

      <p className="text-sm text-gray-500 mb-4">
        ⏱ {chapter.durationMinutes} minutes
      </p>

      <p className="mb-6">
        {chapter.about}
      </p>

      <a
        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
          chapter.youtubeQuery
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline text-sm"
      >
        Search this topic on YouTube
      </a>
    </div>
  );
}
