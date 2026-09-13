"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { GoalWithMeta } from "./page";
import { ArrowRight, Check } from "lucide-react";
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
      className="grid grid-cols-1 gap-3 lg:grid-cols-2"
    >
      {courses.map((goal) => {
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
              className="group block h-full rounded-[22px] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <article className="flex h-full flex-col rounded-[22px] border border-white/[0.07] bg-white/[0.018] transition-[border-color,background-color] duration-200 group-hover:border-white/[0.13] group-hover:bg-white/[0.028]">
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Learning journey
                      </p>
                      <h3 className="mt-2.5 text-xl font-semibold leading-tight tracking-[-0.02em]">
                        {goal.title}
                      </h3>
                    </div>
                    {completed && (
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="size-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="mt-8">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Mastery</span>
                      <span className="font-medium">{goal.progressPercent}%</span>
                    </div>
                    <Progress value={goal.progressPercent} className="h-1" />
                  </div>

                  <div className="mt-6 flex items-center gap-5 text-xs">
                    <span className="text-muted-foreground">{goal.totalSkills} skills</span>
                    <span className="text-muted-foreground">{completed ? "Completed" : "In progress"}</span>
                  </div>

                  {nextGoalSkill && (
                    <div className="mt-6 border-l border-primary/30 pl-4">
                      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Next up
                      </p>
                      <p className="mt-1.5 text-sm font-medium">{nextGoalSkill.skill.title}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4">
                  <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    {completed ? "Review journey" : "Continue journey"}
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foreground" />
                </div>
              </article>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
