"use client";

import type { CourseData } from "@/lib/types";
import { useState, useEffect } from "react";
import { IoPlayCircle, IoDocumentText } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import Button from "@/components/ui/Button";
import ReactMarkdown from "react-markdown";

interface Props {
  course: CourseData;
}

export default function CourseDetailClient({ course }: Props) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [tab, setTab] = useState<"video" | "reading">("video");

  // Local state for chapters so we can update them without refreshing page
  const [chapters, setChapters] = useState(course.chapters);
  const [loading, setLoading] = useState(false);

  const activeChapter = chapters[activeChapterIndex];

  // Auto-trigger generation if content is missing
  useEffect(() => {
    const checkAndGenerate = async () => {
      if (!activeChapter.content || !activeChapter.videoId) {
        setLoading(true);
        try {
          const res = await fetch(
            `/api/courses/${course._id}/chapters/${activeChapterIndex}`,
            {
              method: "POST",
              body: JSON.stringify({ chapterIndex: activeChapterIndex }),
            }
          );

          if (res.ok) {
            const data = await res.json();
            // Update the specific chapter in our state
            const updatedChapters = [...chapters];
            updatedChapters[activeChapterIndex] = data.chapter;
            setChapters(updatedChapters);
          }
        } catch (error) {
          console.error("Failed to generate chapter:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    checkAndGenerate();
  }, [activeChapterIndex, course._id]);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden mt-15">
      {/* SIDEBAR */}
      <aside className="w-80 bg-cardbgclr border-r border-borderclr flex-col overflow-y-auto hidden md:flex">
        <div className="p-6 border-b border-borderclr">
          <h2 className="font-bold text-lg text-primary">{course.name}</h2>
          <p className="text-xs text-graytext mt-1">
            {chapters.length} Chapters
          </p>
        </div>
        <div className="flex-1">
          {chapters.map((chapter, index) => (
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

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-borderclr flex items-center justify-between px-6 bg-cardbgclr/50 backdrop-blur">
          <h1 className="font-semibold text-lg truncate pr-4">
            {activeChapterIndex + 1}. {activeChapter.chapterName}
          </h1>
          <div className="flex gap-2">
            <Button
              onClick={() => setTab("video")}
              className={`text-sm py-1 px-3 ${
                tab === "video"
                  ? "bg-primary text-black"
                  : "bg-transparent border border-graytext text-graytext"
              }`}
            >
              Video
            </Button>
            <Button
              onClick={() => setTab("reading")}
              className={`text-sm py-1 px-3 ${
                tab === "reading"
                  ? "bg-primary text-black"
                  : "bg-transparent border border-graytext text-graytext"
              }`}
            >
              Reading
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          {/* LOADING SKELETON */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/30 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-medium text-white">
                  Creating Chapter Content
                </h3>
                <p className="text-graytext text-sm">
                  AI is writing notes and finding videos...
                </p>
              </div>
            </div>
          ) : (
            <>
              {tab === "video" && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-borderclr">
                    {activeChapter.videoId ? (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${activeChapter.videoId}`}
                        allowFullScreen
                        className="border-none"
                      ></iframe>
                    ) : (
                      <div className="flex items-center justify-center h-full text-graytext">
                        Video could not be found. Try refreshing.
                      </div>
                    )}
                  </div>

                  {activeChapter.videoId && (
                    <div className="flex justify-end">
                      <a
                        href={`https://www.youtube.com/watch?v=${activeChapter.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        Watch on YouTube ↗
                      </a>
                    </div>
                  )}

                  <div className="bg-cardbgclr p-6 rounded-xl border border-borderclr">
                    <h3 className="font-bold text-xl mb-2">
                      About this Chapter
                    </h3>
                    <p className="text-graytext leading-relaxed">
                      {activeChapter.about}
                    </p>
                  </div>
                </div>
              )}

              {tab === "reading" && (
                <div className="max-w-4xl mx-auto bg-cardbgclr p-8 rounded-xl border border-borderclr shadow-lg">
                  <article className="prose prose-sm md:prose-base lg:prose-lg prose-invert max-w-none prose-headings:text-primary prose-a:text-blue-400 prose-strong:text-white">
                    <ReactMarkdown>
                      {activeChapter.content ||
                        "Content generation failed. Please try again."}
                    </ReactMarkdown>
                  </article>
                </div>
              )}
            </>
          )}
        </div>

        {/* NAVIGATION FOOTER */}
        <div className="h-16 border-t border-borderclr bg-cardbgclr flex items-center justify-between px-6">
          <button
            disabled={activeChapterIndex === 0 || loading}
            onClick={() => setActiveChapterIndex((prev) => prev - 1)}
            className="text-sm font-medium hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous Chapter
          </button>
          <button
            disabled={activeChapterIndex === chapters.length - 1 || loading}
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
