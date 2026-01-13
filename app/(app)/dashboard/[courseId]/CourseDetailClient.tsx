"use client";

import type { CourseData } from "@/lib/types";
import { useState, useEffect } from "react";
import { IoPlayCircle } from "react-icons/io5";
import Button from "@/components/ui/Button";
import ReactMarkdown from "react-markdown";
import { BiLeftArrowAlt, BiSolidError } from "react-icons/bi";
import Link from "next/link";
import { toast } from "sonner"; 
import { generateChapter } from "@/app/actions/generateChapter";

interface Props {
  course: CourseData;
}

export default function CourseDetailClient({ course }: Props) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [tab, setTab] = useState<"video" | "reading">("video");
  const [chapters, setChapters] = useState(course.chapters);
  const activeChapter = chapters[activeChapterIndex];

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const runGeneration = async () => {
      if (activeChapter.content && activeChapter.videoId){
        setIsGenerating(false);
        return;
      }

      setIsGenerating(true);
      try {
        const result = await generateChapter({
          courseId: course._id,
          chapterIndex: activeChapterIndex,
        });

        if (result.success && result.chapter) {
          const newChapters = [...chapters];
          newChapters[activeChapterIndex] = result.chapter;
          setChapters(newChapters);
          toast.success("Chapter ready!");
        } else {
          console.error(result.error);
          toast.error("Failed to generate content");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error generating chapter");
      } finally {
        setIsGenerating(false);
      }
    };

    runGeneration();
  }, [activeChapterIndex, course._id]);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
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
              </div>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 glass backdrop-blur-xl flex items-center justify-between px-4 md:px-6 z-10 shrink-0 sticky top-0">
          <h1 className="font-semibold text-lg truncate pr-4">
            {activeChapterIndex + 1}. {activeChapter.chapterName}
          </h1>
          <div className="flex gap-2 bg-cardbgclr p-2 border border-borderclr rounded-lg">
            <button
              onClick={() => setTab("video")}
              className={
                tab === "video"
                  ? "bg-primary text-black px-2 rounded"
                  : "bg-transparent text-white px-2 cursor-pointer hover:text-primary"
              }
            >
              Video
            </button>
            <button
              onClick={() => setTab("reading")}
              className={
                tab === "reading"
                  ? "bg-primary text-black px-2 rounded"
                  : "bg-transparent text-white px-2 cursor-pointer hover:text-primary"
              }
            >
              Reading
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          {isGenerating && (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <p className="text-graytext animate-pulse">
                Generating Content.
              </p>
            </div>
          )}

          {/* VIDEO TAB */}
          {!isGenerating && tab === "video" && (
            <div className="max-w-4xl mx-auto">
              {activeChapter.videoId ? (
                <div className="border-2 border-borderclr rounded-xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeChapter.videoId}`}
                    className="w-full aspect-video rounded-xl"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="text-center flex flex-col gap-4 justify-center items-center w-full aspect-video bg-cardbgclr border-2 border-borderclr rounded-xl">
                  <BiSolidError size={40} color="#FFDE21" />
                  <p className="text-sm">Video not available</p>
                  <a
                    href={`https://www.youtube.com/results?search_query=${activeChapter.chapterName}`}
                    target="_blank"
                  >
                    <Button className="bg-primary">Try Manually</Button>
                  </a>
                </div>
              )}
              <div className="bg-cardbgclr border border-borderclr p-4 mt-6 rounded-lg">
                <p className="text-primary font-semibold mb-2 text-lg">About</p>
                {activeChapter.about}
              </div>
            </div>
          )}

          {/* READING TAB */}
          {!isGenerating && tab === "reading" && (
            <div className="max-w-4xl mx-auto bg-cardbgclr p-8 rounded-xl border border-borderclr shadow-lg">
              <article className="prose prose-sm md:prose-base lg:prose-lg prose-invert max-w-none prose-headings:text-primary">
                <ReactMarkdown>{activeChapter.content || ""}</ReactMarkdown>
              </article>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
