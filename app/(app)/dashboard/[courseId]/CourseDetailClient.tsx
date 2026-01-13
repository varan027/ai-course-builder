"use client";

import type { CourseData } from "@/lib/types";
import { useState, useEffect } from "react";
import { IoPlayCircle, IoReload } from "react-icons/io5";
import Button from "@/components/ui/Button";
import ReactMarkdown from "react-markdown";
import { BiLeftArrowAlt, BiSolidError } from "react-icons/bi";
import Link from "next/link";
import { toast } from "sonner";
import { generateChapter } from "@/app/actions/generateChapter";
import { Skeleton } from "@/components/ui/Skeleton";


interface Props {
  course: CourseData;
}

export default function CourseDetailClient({ course }: Props) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [tab, setTab] = useState<"video" | "reading">("video");
  const [chapters, setChapters] = useState(course.chapters);
  const activeChapter = chapters[activeChapterIndex];

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    const runGeneration = async () => {
      if (activeChapter.content && activeChapter.videoId) {
        setIsGenerating(false);
        setGenerationError(false);
        return;
      }

      setIsGenerating(true);
      setGenerationError(false);

      try {
        const result = await generateChapter({
          courseId: course._id,
          chapterIndex: activeChapterIndex,
        });

        if (result.success && result.chapter) {
          const newChapters = [...chapters];
          newChapters[activeChapterIndex] = result.chapter;
          setChapters(newChapters);
        } else {
          setGenerationError(true);
          toast.error("Failed to generate content");
        }
      } catch (error) {
        console.error(error);
        setGenerationError(true);
      } finally {
        setIsGenerating(false);
      }
    };

    runGeneration();
  }, [activeChapterIndex, course._id, retryTrigger]);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-80 bg-cardbgclr border-r border-borderclr flex-col overflow-y-auto hidden md:flex">
        <Link href="/dashboard">
          <button className="hover:text-primary flex items-center p-2 mt-4 ml-4 gap-2 cursor-pointer hover:bg-primary/4 w-22 rounded-lg transition-all duration-500">
            <BiLeftArrowAlt size={20} /> Back
          </button>
        </Link>

        <div className="p-4 border-b border-borderclr">
          <h2 className="font-bold text-lg text-primary">{course.name}</h2>
          <p className="text-xs text-graytext mt-1">
            {chapters.length} Chapters
          </p>
        </div>

        <div className="flex-1">
          {chapters.map((chapter, index) => {
            const isActive = activeChapterIndex === index;

            return (
              <button
                key={index}
                onClick={() => setActiveChapterIndex(index)}
                className={`w-full text-left p-4 border-b border-borderclr/50 transition-colors flex items-start gap-3
                  ${
                    isActive
                      ? "bg-primary/20 border-l-4 border-l-primary" // Active Style
                      : "hover:bg-uibgclr border-l-4 border-l-transparent" // Inactive Style
                  }`}
              >
                <span className="mt-1">
                  {isActive ? (
                    <IoPlayCircle size={20} className="text-primary" />
                  ) : (
                    <span className="text-xs font-mono ml-1 text-graytext">
                      {index + 1}
                    </span>
                  )}
                </span>
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      isActive ? "text-primary font-bold" : "text-gray-300"
                    }`}
                  >
                    {chapter.chapterName}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#09090b]">
        {/* 1. STICKY HEADER with Segmented Control */}
        <header className="h-18 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl flex items-center justify-between px-6 z-10 shrink-0 sticky top-0">
          <div>
            <span className="text-xs text-primary font-mono mb-1 block">
              CHAPTER {activeChapterIndex + 1}
            </span>
            <h1 className="font-bold text-xl text-white truncate max-w-[50vw]">
              {activeChapter.chapterName}
            </h1>
          </div>

          {/* Segmented Tab Control */}
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setTab("video")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                tab === "video"
                  ? "bg-primary text-black shadow-lg shadow-primary/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Video Lesson
            </button>
            <button
              onClick={() => setTab("reading")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                tab === "reading"
                  ? "bg-primary text-black shadow-lg shadow-primary/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Reading & Notes
            </button>
          </div>
        </header>

        {/* 2. SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          {/* LOADING SKELETON */}
          {isGenerating && (
            <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
              <div className="w-full aspect-video bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 opacity-20">
                  <IoPlayCircle size={40} />
                  <p className="text-xs font-mono">AI is curating content...</p>
                </div>
              </div>
              <div className="bg-cardbgclr border border-white/5 p-8 rounded-2xl space-y-4">
                <Skeleton className="h-8 w-1/3 mb-6" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {!isGenerating && generationError && (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 bg-red-500/5 rounded-3xl border border-red-500/10 p-12 max-w-2xl mx-auto mt-10">
              <div className="bg-red-500/10 p-6 rounded-full animate-bounce">
                <BiSolidError className="text-red-500 text-4xl" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  Generation Failed
                </h3>
                <p className="text-gray-400 max-w-xs mx-auto">
                  Our AI agents hit a snag while researching this topic.
                </p>
              </div>
              <Button
                onClick={() => setRetryTrigger((prev) => prev + 1)}
                className="bg-red-500 hover:bg-red-600 text-white px-8"
              >
                <IoReload className="mr-2" /> Try Again
              </Button>
            </div>
          )}

          {/* VIDEO TAB CONTENT */}
          {!isGenerating && !generationError && tab === "video" && (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Cinematic Video Player */}
              {activeChapter.videoId ? (
                <div className="relative group">
                  {/* Ambient Background Glow */}
                  <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-blue-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>

                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                    <iframe
                      key={activeChapter.videoId}
                      src={`https://www.youtube.com/embed/${activeChapter.videoId}?autoplay=0&rel=0&modestbranding=1`}
                      className="w-full aspect-video"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center flex flex-col gap-4 justify-center items-center w-full aspect-video bg-white/5 border border-white/10 rounded-2xl">
                  <BiSolidError size={40} className="text-yellow-500" />
                  <p className="text-sm text-gray-400">
                    Video unavailable for this topic
                  </p>
                </div>
              )}

              {/* About Section */}
              <div className="bg-cardbgclr border border-white/5 p-8 rounded-2xl shadow-sm">
                <h3 className="text-primary font-bold mb-4 text-lg flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full"></span>
                  Key Takeaways
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {activeChapter.about}
                </p>
              </div>
            </div>
          )}

          {/* READING TAB CONTENT */}
          {!isGenerating && !generationError && tab === "reading" && (
            <div className="max-w-4xl mx-auto bg-cardbgclr p-10 rounded-2xl border border-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <article
                className="prose prose-lg prose-invert max-w-none 
                prose-headings:text-white prose-headings:font-bold prose-h1:text-primary 
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-code:text-primary prose-code:bg-white/5 prose-code:px-1 prose-code:rounded
                prose-pre:bg-black prose-pre:border prose-pre:border-white/10
              "
              >
                <ReactMarkdown>{activeChapter.content || ""}</ReactMarkdown>
              </article>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
