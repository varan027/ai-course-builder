"use client";

import { CourseContext } from "./courseContext";
import { Course } from "@/services/course.service";

export default function CourseProvider({
  course,
  children,
}: {
  course: Course;
  children: React.ReactNode;
}) {
  return (
    <CourseContext.Provider value={course}>
      {children}
    </CourseContext.Provider>
  );
}
