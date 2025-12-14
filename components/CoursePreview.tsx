"use client";
import React from "react";
import { Course, Lesson } from "../lib/types";
import Textarea from "./ui/Textarea";
import Card from "./ui/Card";

interface Props {
  lesson?: Lesson | null;
  onChange?: (u: Lesson) => void;
}

export default function CoursePreview({ lesson, onChange }: Props) {
  if (!lesson) {
    return (
      <div>
        Lesson not found or not loaded.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {lesson.videoIds?.length ?  (
              <div className="w-full h-56 rounded-md border border-dashed flex items-center justify-center text-gray-400">
                No suggested video
              </div>
            ) : (
              <div className="w-full h-56 rounded-md border border-dashed flex items-center justify-center text-gray-400">
                No video available
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="font-semibold mb-2">{lesson.title}</div>
            <Textarea
              value={lesson.content}
              onChange={(e) =>
                onChange && onChange({
                  ...lesson, content: e.target.value,
                  index: 0
                })
              }
            />
            <div className="text-xs text-gray-500 mt-2">Autosave enabled</div>
          </div>
        </div>
      </div>
    </div>
  );
}
