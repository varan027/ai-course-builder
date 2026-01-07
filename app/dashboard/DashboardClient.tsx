"use client";
import NavBar from "@/components/NavBar";
import { CourseData } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export const DashboardClient = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("api/courses");

      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setCourses(data.courses);
      setLoading(false);
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="bg-uibgclr/25  rounded-lg p-6 max-w-[96vw] mx-auto mt-20">
          <div className="h-8 bg-uibgclr rounded-lg w-1/6 mb-6"></div>
          <div className=" grid grid-cols-3 gap-4">
            <div className="bg-uibgclr/50 rounded-lg w-full p-6">
              <div className="h-6 bg-uibgclr rounded-lg w-4/6 mb-6"></div>
              <div className="h-3 bg-uibgclr rounded-lg w-full mb-4"></div>
              <div className="h-3 bg-uibgclr rounded-lg w-full mb-4"></div>
              <div className="h-3 bg-uibgclr rounded-lg w-5/6"></div>
            </div>
            <div className="bg-uibgclr/50 rounded-lg w-full p-6">
              <div className="h-6 bg-uibgclr rounded-lg w-4/6 mb-6"></div>
              <div className="h-3 bg-uibgclr rounded-lg w-full mb-4"></div>
              <div className="h-3 bg-uibgclr rounded-lg w-full mb-4"></div>
              <div className="h-3 bg-uibgclr rounded-lg w-5/6"></div>
            </div>
            <div className="bg-uibgclr/50 rounded-lg w-full p-6">
              <div className="h-6 bg-uibgclr rounded-lg w-4/6 mb-6"></div>
              <div className="h-3 bg-uibgclr rounded-lg w-full mb-4"></div>
              <div className="h-3 bg-uibgclr rounded-lg w-full mb-4"></div>
              <div className="h-3 bg-uibgclr rounded-lg w-5/6"></div>
            </div>
            <div className="bg-uibgclr/50 rounded-lg w-full p-6">
              <div className="h-6 bg-uibgclr rounded-lg w-4/6 mb-6"></div>
              <div className="h-3 bg-uibgclr rounded-lg w-full mb-4"></div>
              <div className="h-3 bg-uibgclr rounded-lg w-full mb-4"></div>
              <div className="h-3 bg-uibgclr rounded-lg w-5/6"></div>
            </div>
            <div className="bg-uibgclr/50 rounded-lg w-full p-6">
              <div className="h-6 bg-uibgclr rounded-lg w-4/6 mb-6"></div>
              <div className="h-3 bg-uibgclr rounded-lg w-full mb-4"></div>
              <div className="h-3 bg-uibgclr rounded-lg w-full mb-4"></div>
              <div className="h-3 bg-uibgclr rounded-lg w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return <div>no courses found</div>;
  }

  return (
    <div className="p-6">
      <NavBar />
      <div className="mt-16 bg-cardbgclr p-4 border border-borderclr rounded-lg space-y-4">
        <h1 className="font-mono font-extrabold md:text-4xl text-2xl text-primary">
          MY COURSES
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-uibgclr p-4 rounded-lg border border-borderclr"
            >
              <Link href={`/dashboard/${course._id}`}>
                <div>
                  <h2 className="text-lg font-medium"> {course.name} </h2>
                  <div className="flex justify-between mt-6">
                    <p className="text-xs"> {course.level} </p>
                    <p className="text-xs "> {course.duration} </p>
                  </div>
                  <p className="text-xs text-graytext mt-2">
                    {" "}
                    {new Date(course?.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    })}{" "}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;
