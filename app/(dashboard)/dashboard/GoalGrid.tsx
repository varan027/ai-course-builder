"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { GoalWithMeta } from "./page";
import { ArrowUpRight, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GoalGridProps {
  courses: GoalWithMeta[];
}

export default function GoalGrid({ courses }: GoalGridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.05 } },
      }}
      className="divide-y divide-white/[0.07] border-y border-white/[0.07]"
    >
      {courses.map((goal, index) => {
        const nextGoalSkill = goal.goalSkills.find((goalSkill) => !goalSkill.mastered);
        const completed = goal.progressPercent === 100;

        return (
          <motion.div
            key={goal.id}
            variants={{
              hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Link
              href={`/courses/${goal.id}`}
              className="group grid gap-5 px-1 py-7 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:grid-cols-[2.5rem_minmax(0,1fr)_minmax(13rem,20rem)_auto] sm:items-center sm:px-2"
            >
              <span className="text-xs tabular-nums text-muted-foreground/50">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {completed && <Check className="size-3.5 text-primary" />}
                  <h3 className="truncate text-lg font-medium tracking-tight transition-colors group-hover:text-primary">
                    {goal.title}
                  </h3>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Progress value={goal.progressPercent} className="h-1 max-w-44" />
                  <span className="text-xs text-muted-foreground">{goal.progressPercent}% mastery</span>
                </div>
              </div>

              <div className="min-w-0 border-l border-white/[0.07] pl-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {completed ? "Completed" : "Next up"}
                </p>
                <p className="mt-1.5 truncate text-sm font-medium">
                  {nextGoalSkill?.skill.title ?? "Review your journey"}
                </p>
              </div>

              <ArrowUpRight className="size-4 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
