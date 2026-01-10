"use client";

import type { CourseData } from "@/lib/types";
import { useState, useEffect } from "react";
import {
  IoPlayCircle,
  IoDocumentText,
  IoVideocam,
  IoWarning,
  IoRefresh,
} from "react-icons/io5";
import Button from "@/components/ui/Button";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface Props {
  course: CourseData;
}

export default function CourseDetailClient({ course }: Props) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [tab, setTab] = useState<"video" | "reading">("video");

  // Local state for instant updates
  const [chapters, setChapters] = useState(course.chapters);
  const activeChapter = chapters[activeChapterIndex];

  // Loading States
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [loadingText, setLoadingText] = useState(false);

  // --- GENERATION LOGIC ---
  const generateChapterResources = async (force = false) => {
    // 1. Generate Video (if missing or forced)
    if ((!activeChapter.videoId || force) && !loadingVideo) {
      setLoadingVideo(true);
      try {
        const res = await fetch(
          `/api/courses/${course._id}/chapters/${activeChapterIndex}`,
          {
            method: "POST",
            body: JSON.stringify({ type: "video" }),
          }
        );
        const data = await res.json();

        if (data.videoId) {
          const updated = [...chapters];
          updated[activeChapterIndex] = {
            ...updated[activeChapterIndex],
            videoId: data.videoId,
          };
          setChapters(updated);
          if (force) toast.success("Video updated");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingVideo(false);
      }
    }

    // 2. Generate Text (if missing or forced) - STANDARD FETCH
    if ((!activeChapter.content || force) && !loadingText) {
      setLoadingText(true);
      try {
        const res = await fetch(
          `/api/courses/${course._id}/chapters/${activeChapterIndex}`,
          {
            method: "POST",
            body: JSON.stringify({ type: "content" }),
          }
        );
        const data = await res.json();

        if (data.content) {
          const updated = [...chapters];
          updated[activeChapterIndex] = {
            ...updated[activeChapterIndex],
            content: data.content,
          };
          setChapters(updated);
          if (force) toast.success("Content regenerated");
        }
      } catch (err) {
        toast.error("Failed to generate content");
      } finally {
        setLoadingText(false);
      }
    }
  };

  // Trigger on chapter change
  useEffect(() => {
    generateChapterResources();
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
              onClick={() => {
                setActiveChapterIndex(index);
                setTab("video");
              }}
              className={`w-full text-left p-4 border-b border-borderclr/50 hover:bg-uibgclr transition-all flex items-start gap-3
                ${
                  activeChapterIndex === index
                    ? "bg-primary/10 border-l-4 border-l-primary"
                    : "hover:pl-6"
                }`}
            >
              <span className="mt-1 text-primary">
                {activeChapterIndex === index ? (
                  <IoPlayCircle size={20} />
                ) : (
                  <span className="text-xs font-mono ml-1 text-graytext">
                    {index + 1}
                  </span>
                )}
              </span>
              <div>
                <h3
                  className={`text-sm font-medium ${
                    activeChapterIndex === index
                      ? "text-primary"
                      : "text-gray-400"
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

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-borderclr flex items-center justify-between px-6 bg-cardbgclr/50 backdrop-blur z-10">
          <h1 className="font-semibold text-lg truncate pr-4 flex items-center gap-2">
            <span className="text-graytext font-mono">
              0{activeChapterIndex + 1}.
            </span>
            {activeChapter.chapterName}
          </h1>
          <div className="flex gap-2 items-center">
            {/* RETRY BUTTON */}
            <Button
              onClick={() => generateChapterResources(true)}
              disabled={loadingText || loadingVideo}
              className="bg-uibgclr border border-borderclr text-white hover:bg-white/10 text-xs h-9"
            >
              <IoRefresh
                className={`mr-2 ${
                  loadingText || loadingVideo ? "animate-spin" : ""
                }`}
              />
              Regenerate
            </Button>

            <div className="flex bg-uibgclr p-1 rounded-lg border border-borderclr ml-2">
              <button
                className={`text-sm py-1 px-4 rounded-md transition-all flex items-center gap-2 ${
                  tab === "video"
                    ? "bg-primary text-black"
                    : "text-graytext hover:text-white"
                }`}
                onClick={() => setTab("video")}
              >
                <IoVideocam /> Video
              </button>
              <button
                className={`text-sm py-1 px-4 rounded-md transition-all flex items-center gap-2 ${
                  tab === "reading"
                    ? "bg-primary text-black"
                    : "text-graytext hover:text-white"
                }`}
                onClick={() => setTab("reading")}
              >
                <IoDocumentText /> Reading
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-thin">
          {tab === "video" && (
            <div className="max-w-4xl mx-auto space-y-6 fade-in-animation">
              <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-borderclr relative">
                {loadingVideo ? (
                  <div className="w-full h-full flex flex-col items-center justify-center space-y-4 animate-pulse bg-uibgclr">
                    <div className="w-16 h-16 bg-cardbgclr rounded-full flex items-center justify-center">
                      <IoVideocam className="text-graytext/50 text-2xl" />
                    </div>
                    <p className="text-graytext text-sm">
                      Searching YouTube...
                    </p>
                  </div>
                ) : activeChapter.videoId ? (
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
                  <div className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-uibgclr">
                    <IoWarning className="text-yellow-500 text-4xl" />
                    <p className="text-graytext text-sm">
                      Video not available.
                    </p>
                  </div>
                )}
              </div>
              <div className="bg-cardbgclr p-8 rounded-xl border border-borderclr">
                <h3 className="font-bold text-xl mb-4 text-primary">
                  About this Chapter
                </h3>
                <p className="text-graytext leading-relaxed">
                  {activeChapter.about}
                </p>
              </div>
            </div>
          )}

          {tab === "reading" && (
            <div className="max-w-4xl mx-auto bg-cardbgclr p-8 md:p-12 rounded-xl border border-borderclr shadow-lg min-h-[50vh]">
              <article className="prose prose-sm md:prose-base lg:prose-lg prose-invert max-w-none prose-headings:text-primary">
                {/* Renders content if available */}
                <ReactMarkdown>{activeChapter.content || ""}</ReactMarkdown>

                {/* Skeleton Loader for Text */}
                {loadingText && (
                  <div className="space-y-4 animate-pulse mt-4">
                    <div className="h-4 bg-uibgclr rounded w-3/4"></div>
                    <div className="h-4 bg-uibgclr rounded w-full"></div>
                    <div className="h-4 bg-uibgclr rounded w-5/6"></div>
                    <div className="h-4 bg-uibgclr rounded w-full"></div>
                  </div>
                )}
              </article>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
