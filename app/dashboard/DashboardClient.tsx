"use client";
import { CourseData } from "@/lib/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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

  const handleDelete = async (courseId: string) => {
    const res = await fetch(`/api/courses/${courseId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
    }
  };

  if (loading) {
    return <div>loading your courses</div>;
  }

  if (courses.length === 0) {
    return <div>no courses found</div>;
  }
  

  return (
    <div className="p-6">
      <h1 className="text-primary mb-4">My Courses</h1>

      {courses.map((course) => (
        <div key={course._id} className="p-3 rounded space-y-2 border mb-4">
          <Link href={`/dashboard/${course._id}`}>
            <div>
              <h2 className="text-xl text-primary"> {course.name} </h2>
              <p> {course.description} </p>
            </div>
          </Link>
          <button
              onClick={() => handleDelete(course._id)}
              className="text-red-500 cursor-pointer border p-2 py-1 text-sm rounded"
            >
              Delete
            </button>
        </div>
      ))}
    </div>
  );
};

export default DashboardClient;
