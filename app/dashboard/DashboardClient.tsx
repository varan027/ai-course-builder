"use client";

import { CourseData } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoBookOutline, IoTimeOutline, IoAdd, IoArrowForward, IoTrashOutline } from "react-icons/io5";
import { BsBarChart, BsCalendar3 } from "react-icons/bs";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const getGradient = (id: string) => {
  const gradients = [
    "from-emerald-500 to-emerald-900", "from-blue-500 to-blue-900",
    "from-purple-500 to-purple-900", "from-orange-500 to-orange-900",
  ];
  return gradients[id.charCodeAt(0) % gradients.length];
};

export const DashboardClient = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data.courses || []))
      .catch(() => toast.error("Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (e: React.MouseEvent, courseId: string) => {
    e.preventDefault(); 
    e.stopPropagation(); // Stop link click
    if (!confirm("Delete this course permanently?")) return;

    // Optimistic Remove
    const original = [...courses];
    setCourses(courses.filter((c) => c._id !== courseId));

    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Course deleted");
      router.refresh();
    } catch (err) {
      setCourses(original); // Revert
      toast.error("Could not delete course");
    }
  };

  return (
    <div className="min-h-screen pb-20 max-w-7xl mx-auto px-4 md:px-8 mt-24">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Learning Paths</h1>
          <p className="text-graytext">Manage your AI-generated courses.</p>
        </div>
        <Link href="/create-course">
          <Button className="flex items-center gap-2"><IoAdd size={20} /> New Course</Button>
        </Link>
      </div>

      {loading && <div className="text-graytext">Loading your courses...</div>}

      {!loading && courses.length === 0 && (
        <div className="text-center py-20 border border-dashed border-borderclr rounded-2xl">
          <h2 className="text-xl font-bold text-white">No courses yet</h2>
          <Link href="/create-course" className="text-primary mt-2 inline-block">Create one now →</Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="relative group">
            <Link href={`/dashboard/${course._id}`} className="block h-full bg-cardbgclr border border-borderclr rounded-xl overflow-hidden hover:border-primary/50 transition-all">
              <div className={`h-2 bg-gradient-to-r ${getGradient(course._id)}`}></div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-2 line-clamp-1">{course.name}</h2>
                <p className="text-sm text-graytext line-clamp-2 mb-6">{course.description}</p>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><BsBarChart className="text-primary"/> {course.level}</span>
                  <span className="flex items-center gap-1"><IoBookOutline className="text-primary"/> {course.chapters.length} Chapters</span>
                </div>
              </div>
            </Link>
            <button
              onClick={(e) => handleDelete(e, course._id)}
              className="absolute top-4 right-4 p-2 bg-uibgclr/80 text-graytext hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete"
            >
              <IoTrashOutline size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardClient;