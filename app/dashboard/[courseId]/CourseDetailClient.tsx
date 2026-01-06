"use client";

import type { CourseData } from "@/lib/types";
import { useState } from "react";

interface Props {
  course: CourseData;
}

export default function CourseDetailClient({ course }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{course.name}</h1>
        <p className="text-gray-500 mt-2">{course.description}</p>
      </div>

      <div className="flex gap-6 text-sm text-gray-600">
        <span>Level: {course.level}</span>
        <span>Duration: {course.duration}</span>
        <span>Chapters: {course.outline.chapters.length}</span>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Chapters</h2>

        {course.outline.chapters.map((chapter, index) => (
          <div
            key={index}
            className="border rounded p-4 cursor-pointer"
            onClick={() =>
              setOpenIndex(openIndex === index ? null : index)
            }
          >
            <div className="font-medium">
              {index + 1}. {chapter.chapterName}
            </div>

            {openIndex === index && (
              <div className="mt-2 text-sm text-gray-600">
                <p>{chapter.about}</p>
                <p className="mt-1">⏱ {chapter.duration}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
