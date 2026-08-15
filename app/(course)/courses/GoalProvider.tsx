"use client";

import { GoalContext } from "./GoalContext";
import { Goal } from "@/services/goal.service";

export default function GoalProvider({
  goal,
  children,
}: {
  goal: Goal;
  children: React.ReactNode;
}) {
  return (
    <GoalContext.Provider value={goal}>
      {children}
    </GoalContext.Provider>
  );
}