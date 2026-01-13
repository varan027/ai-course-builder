"use client";

import NavBar from "@/components/NavBar";
import { CourseData } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  IoBookOutline,
  IoTimeOutline,
  IoAdd,
  IoArrowForward,
} from "react-icons/io5";
import { BsBarChart, BsCalendar3 } from "react-icons/bs";
import Button from "@/components/ui/Button";

// Helper to generate a consistent gradient based on the course ID string
const getGradient = (id: string) => {
  const gradients = [
    "from-emerald-500 to-emerald-900",
    "from-blue-500 to-blue-900",
    "from-purple-500 to-purple-900",
    "from-orange-500 to-orange-900",
    "from-pink-500 to-pink-900",
  ];
  const index = id.charCodeAt(10) % gradients.length;
  return gradients[index];
};

export const DashboardClient = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses);
        }
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-18">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              My Learning Paths
            </h1>
            <p className="text-graytext text-sm md:text-base">
              Continue where you left off or start a new journey.
            </p>
          </div>
          <Link href="/create-course">
            <Button className="flex items-center gap-2 shadow-lg shadow-primary/20">
              <IoAdd size={20} />
              Create New Course
            </Button>
          </Link>
        </div>

        {/* LOADING SKELETON */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-cardbgclr rounded-xl h-64 border border-borderclr animate-pulse p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="h-6 bg-uibgclr rounded w-3/4"></div>
                  <div className="h-4 bg-uibgclr rounded w-full"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-uibgclr rounded w-1/4"></div>
                  <div className="h-4 bg-uibgclr rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && courses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-borderclr rounded-2xl bg-uibgclr/20">
            <div className="w-16 h-16 bg-uibgclr rounded-full flex items-center justify-center mb-4">
              <IoBookOutline size={32} className="text-graytext" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No courses yet
            </h2>
            <p className="text-graytext mb-6 text-center max-w-sm">
              You haven't generated any courses yet. Create your first
              AI-powered learning path today.
            </p>
            <Link href="/create-course">
              <Button>Generate First Course</Button>
            </Link>
          </div>
        )}

        {/* COURSE GRID */}
        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                href={`/dashboard/${course._id}`}
                key={course._id}
                className="group relative flex flex-col h-full bg-cardbgclr border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 ease-out hover:-translate-y-1"
              >
                {/* 1. TOP GRADIENT ACCENT (Subtle Glow) */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getGradient(
                    course._id
                  )} opacity-70`}
                />

                <div className="p-6 flex flex-col h-full relative">
                  {/* 2. HEADER: Badge + Date */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 text-[10px] font-bold tracking-wide uppercase rounded-full bg-white/5 text-primary border border-white/10 group-hover:bg-primary group-hover:text-black transition-colors">
                      {course.level}
                    </span>
                    <span className="text-[10px] text-graytext/60 font-mono">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* 3. TITLE & DESCRIPTION */}
                  <div className="mb-auto space-y-2">
                    <h2 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {course.name}
                    </h2>
                    <p className="text-sm text-graytext line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* 4. METADATA FOOTER (Clean Row) */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex items-center gap-1.5 tooltip"
                        title="Duration"
                      >
                        <IoTimeOutline className="text-primary text-base" />
                        <span>{course.duration}h</span>
                      </div>
                      <div
                        className="flex items-center gap-1.5 tooltip"
                        title="Chapters"
                      >
                        <IoBookOutline className="text-primary text-base" />
                        <span>{course.chapters?.length || 0} Ch</span>
                      </div>
                    </div>

                    {/* 5. ACTION ARROW */}
                    <div className="flex items-center gap-1 text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 font-medium text-xs">
                      Open <IoArrowForward />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardClient;
