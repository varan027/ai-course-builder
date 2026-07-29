"use client";

import { CourseContext } from "./courseContext";
import { Goal } from "@/services/goal.service";

export default function CourseProvider({
  goal,
  children,
}: {
  goal: Goal;
  children: React.ReactNode;
}) {
  return (
    <CourseContext.Provider value={goal}>
      {children}
    </CourseContext.Provider>
  );
}