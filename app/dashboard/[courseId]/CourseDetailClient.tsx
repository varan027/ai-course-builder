"use client";

import type { CourseData } from "@/lib/types";
import { useState } from "react";
import { IoPlayCircle, IoDocumentText } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import Button from "@/components/ui/Button";
import ReactMarkdown from "react-markdown";

interface Props {
  course: CourseData;
}

export default function CourseDetailClient({ course }: Props) {
  // Default to the first chapter
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [tab, setTab] = useState<"video" | "reading">("video");

  const activeChapter = course.chapters[activeChapterIndex];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* SIDEBAR - Chapter Navigation */}
      <aside className="w-80 bg-cardbgclr border-r border-borderclr flex-col overflow-y-auto hidden md:flex">
        <div className="p-6 border-b border-borderclr">
          <h2 className="font-bold text-lg text-primary">{course.name}</h2>
          <p className="text-xs text-graytext mt-1">
            {course.chapters.length} Chapters
          </p>
        </div>

        <div className="flex-1">
          {course.chapters.map((chapter, index) => (
            <button
              key={index}
              onClick={() => setActiveChapterIndex(index)}
              className={`w-full text-left p-4 border-b border-borderclr/50 hover:bg-uibgclr transition-colors flex items-start gap-3
                ${
                  activeChapterIndex === index
                    ? "bg-primary/10 border-l-4 border-l-primary"
                    : ""
                }`}
            >
              <span className="mt-1 text-primary">
                {activeChapterIndex === index ? (
                  <IoPlayCircle size={20} />
                ) : (
                  <span className="text-xs font-mono ml-1">{index + 1}</span>
                )}
              </span>
              <div>
                <h3
                  className={`text-sm font-medium ${
                    activeChapterIndex === index
                      ? "text-primary"
                      : "text-gray-300"
                  }`}
                >
                  {chapter.chapterName}
                </h3>
                <p className="text-xs text-graytext mt-1">{chapter.duration}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Bar (Mobile Nav would go here) */}
        <header className="h-16 border-b border-borderclr flex items-center justify-between px-6 bg-cardbgclr/50 backdrop-blur">
          <h1 className="font-semibold text-lg truncate pr-4">
            {activeChapterIndex + 1}. {activeChapter.chapterName}
          </h1>
          <div className="flex gap-2">
            <Button
              className={`text-sm py-1 px-3 ${
                tab === "video"
                  ? "bg-primary text-black"
                  : "bg-transparent border border-graytext text-graytext"
              }`}
              onClick={() => setTab("video")}
            >
              Video
            </Button>
            <Button
              className={`text-sm py-1 px-3 ${
                tab === "reading"
                  ? "bg-primary text-black"
                  : "bg-transparent border border-graytext text-graytext"
              }`}
              onClick={() => setTab("reading")}
            >
              Reading
            </Button>
          </div>
        </header>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          {/* VIDEO TAB */}
          {tab === "video" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-borderclr">
                {activeChapter.videoId ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${activeChapter.videoId}`}
                    title={activeChapter.chapterName}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full text-graytext">
                    Video not available for this chapter
                  </div>
                )}
              </div>
              <div className="bg-cardbgclr p-6 rounded-xl border border-borderclr">
                <h3 className="font-bold text-xl mb-2">About this Chapter</h3>
                <p className="text-graytext leading-relaxed">
                  {activeChapter.about}
                </p>
              </div>
            </div>
          )}

          {/* READING TAB */}
          {tab === "reading" && (
            <div className="max-w-4xl mx-auto bg-cardbgclr p-8 rounded-xl border border-borderclr shadow-lg">
              {/* Note: You should install 'react-markdown' for this to render nicely: npm install react-markdown */}
              {/* <div className="prose prose-invert prose-green max-w-none"> */}
              {/* <ReactMarkdown>{activeChapter.content}</ReactMarkdown> */}
              {/* Fallback if react-markdown isn't installed yet: */}
              {/* <div className="whitespace-pre-wrap font-sans leading-relaxed text-gray-300">
                  {activeChapter.content || "Generating reading material..."}
                </div>
              </div> */}
              <article className="prose prose-sm md:prose-base lg:prose-lg prose-invert max-w-none prose-headings:text-primary prose-a:text-blue-400 prose-strong:text-white"
              >
                <ReactMarkdown>
                  {activeChapter.content || "Generating reading material..."}
                </ReactMarkdown>
              </article>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="h-16 border-t border-borderclr bg-cardbgclr flex items-center justify-between px-6">
          <button
            disabled={activeChapterIndex === 0}
            onClick={() => setActiveChapterIndex((prev) => prev - 1)}
            className="text-sm font-medium hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous Chapter
          </button>

          <button
            disabled={activeChapterIndex === course.chapters.length - 1}
            onClick={() => setActiveChapterIndex((prev) => prev + 1)}
            className="text-sm font-medium hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Chapter →
          </button>
        </div>
      </main>
    </div>
  );
}
