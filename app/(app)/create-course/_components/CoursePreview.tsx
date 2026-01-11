"use client";
import type { CourseData } from "@/lib/types";
import { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { BsBarChart } from "react-icons/bs";
import { GoClock } from "react-icons/go";
import { IoBookOutline, IoPlayOutline } from "react-icons/io5";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface CourseProps {
  loading: boolean;
  activeCourse: CourseData | null;
}

const CoursePreview = ({ loading, activeCourse }: CourseProps) => {
  const router = useRouter();
  const [courseState, setCourseState] = useState<CourseData | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activeCourse) {
      setCourseState(activeCourse);
    }
  }, [activeCourse]);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex == index ? null : index);
  };

  const handleChaptersInlineEdit = (index: number, newName: string) => {
    if (!courseState) return;
    const updatedChapters = [...courseState.outline.chapters];
    updatedChapters[index].chapterName = newName;

    setCourseState({
      ...courseState,
      outline: {
        ...courseState.outline,
        chapters: updatedChapters,
      },
      chapters: updatedChapters,
    });
  };

  const handleConfirm = async () => {
    if (!courseState) return;
    setIsSaving(true);

    try {
      const res = await fetch("api/courses/create", {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify({ course: courseState }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`dashboard/${data.course._id}`);
      } else {
        const errorData = await res.json();
        console.error("Server Error Details:", errorData);
        alert(`Error: ${errorData.error || "Failed to save course"}`);
      }

      toast.success("Course created successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error Saving");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse ml-4">
        <div className="bg-uibgclr/25 w-[70vw] rounded-lg p-6 text-graytext/40 text-xl mb-4 flex">
          <div className="w-1/2">
            <div className="h-8 bg-uibgclr rounded-lg w-5/6 mb-6"></div>
            <div className="h-4 bg-uibgclr rounded-lg w-5/6 mb-4"></div>
            <div className="h-4 bg-uibgclr rounded-lg w-5/6 mb-4"></div>
            <div className="h-4 bg-uibgclr rounded-lg w-4/6"></div>
          </div>
          <div className="h-38 bg-uibgclr rounded-lg w-1/2"></div>
        </div>
        <div className="bg-uibgclr/25 w-[70vw] rounded-lg p-6 text-graytext/40 text-xl mb-4 space-y-4">
            <div className="h-8 bg-uibgclr rounded-lg w-4/6 mb-6"></div>
            <div className="h-4 bg-uibgclr rounded-lg w-full mb-4"></div>
            <div className="h-4 bg-uibgclr rounded-lg w-full"></div>
        </div>
        <div className="bg-uibgclr/25 w-[70vw] rounded-lg p-6 text-graytext/40 text-xl mb-4 space-y-4">
          <div className="bg-uibgclr/50 rounded-lg w-full p-6">
            <div className="h-8 bg-uibgclr rounded-lg w-4/6 mb-6"></div>
            <div className="h-4 bg-uibgclr rounded-lg w-full mb-4"></div>
            <div className="h-4 bg-uibgclr rounded-lg w-full mb-4"></div>
            <div className="h-4 bg-uibgclr rounded-lg w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:w-[72vw] w-[96vw] px-4">
      {!courseState ? (
        <div className="">
          <div className="bg-cardbgclr border border-borderclr rounded-xl p-6 h-100 flex items-center">
            <h1 className="font-mono font-extrabold text-5xl md:text-7xl text-graytext ">
              GENERATE COURSES <br /> IN ONE CLICK
            </h1>
          </div>
        </div>
      ) : (
        <div>
          <div key={courseState?._id} className="space-y-4">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-12 rounded-lg bg-cardbgclr border border-borderclr">
              <div>
                <h2 className="font-bold text-2xl text-primary">
                  {courseState?.name}
                </h2>
                <p className="text-sm text-graytext/80 mt-3">
                  {courseState?.description}
                </p>
              </div>
              <div className="bg-uibgclr rounded-lg p-4">
                <div className="text-graytext/60 text-center mt-8">
                  Course Image
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 p-6 w-full bg-cardbgclr border border-borderclr rounded-lg">
              <div className="text-primary flex items-center md:justify-center gap-4">
                <BsBarChart size={30} />
                <div>
                  <p className="text-xs text-graytext">Skill Level</p>
                  <p className="font-medium text-white">{courseState?.level}</p>
                </div>
              </div>
              <div className="text-primary flex items-center md:justify-center gap-4">
                <GoClock size={30} />
                <div>
                  <p className="text-xs text-graytext">Duration</p>
                  <p className="font-medium text-white">
                    {courseState?.duration}h
                  </p>
                </div>
              </div>
              <div className="text-primary flex items-center md:justify-center gap-4">
                <IoBookOutline size={30} />
                <div>
                  <p className="text-xs text-graytext">No of Chapters</p>
                  <p className="font-medium text-white">
                    {courseState?.outline?.chapters?.length}
                  </p>
                </div>
              </div>
              <div className="text-primary flex items-center md:justify-center gap-4">
                <IoPlayOutline size={30} />
                <div>
                  <p className="text-xs text-graytext">Skill Level</p>
                  <p className="font-medium text-white">{courseState?.level}</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-cardbgclr border border-borderclr rounded-lg space-y-4">
              <h2 className="text-lg font-semibold text-primary mb-4">
                Chapters
              </h2>
              {courseState?.outline?.chapters?.map((chapter, index) => (
                <div
                  key={index}
                  className="bg-uibgclr rounded-lg border border-borderclr p-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="w-full flex items-center gap-4 font-medium text-white">
                      <span className="bg-primary text-sm rounded-full w-7 h-7 text-black flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <input
                        className="bg-transparent border-b border-transparent hover:border-gray-500 focus:border-primary focus:outline-none w-full py-1 transition-colors"
                        value={chapter.chapterName}
                        onChange={(e) =>
                          handleChaptersInlineEdit(index, e.target.value)
                        }
                      />
                    </div>
                    <button
                      className="cursor-pointer text-xl md:ml-28"
                      onClick={() => {
                        toggle(index);
                      }}
                    >
                      {activeIndex == index ? (
                        <IoIosArrowUp />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </button>
                  </div>
                  <div
                    className={activeIndex == index ? "mt-4 block" : "hidden"}
                  >
                    <div className="font-normal text-graytext mt-3 text-sm ">
                      {chapter.about}
                    </div>
                    <div className="text-xs text-graytext/70 font-normal mt-3">
                      {chapter.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pb-10">
              <Button
                className="font-semibold text-lg"
                onClick={handleConfirm}
                disabled={isSaving}
              >
                {isSaving ? "Generating Course........." : "Confirm Generate"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePreview;
