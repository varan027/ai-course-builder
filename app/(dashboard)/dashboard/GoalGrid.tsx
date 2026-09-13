"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { GoalWithMeta } from "./page";
import { ArrowRight, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GoalGridProps {
  courses: GoalWithMeta[];
}

export default function GoalGrid({ courses }: GoalGridProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
    >
      {courses.map((goal) => {
        const nextGoalSkill = goal.goalSkills.find((goalSkill) => !goalSkill.mastered);
        const completed = goal.progressPercent === 100;

        return (
          <motion.div
            key={goal.id}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Link
              href={`/courses/${goal.id}`}
              className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] transition-colors duration-200 group-hover:border-white/[0.16] group-hover:bg-white/[0.035]">
                <div className="flex-1 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Learning journey
                      </p>
                      <h3 className="mt-3 text-xl font-semibold leading-tight tracking-tight">
                        {goal.title}
                      </h3>
                    </div>
                    <Target className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  </div>

                  <div className="mt-7">
                    <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                      <span>Mastery</span>
                      <span>{goal.progressPercent}%</span>
                    </div>
                    <Progress value={goal.progressPercent} className="h-1.5" />
                  </div>

                  <div className="mt-6 flex items-center gap-6 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Skills</p>
                      <p className="mt-1 font-medium">{goal.totalSkills}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="mt-1 font-medium">{completed ? "Completed" : "In progress"}</p>
                    </div>
                  </div>

                  {nextGoalSkill && (
                    <div className="mt-6 rounded-xl border border-primary/10 bg-primary/[0.04] px-4 py-3">
                      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
                        Next skill
                      </p>
                      <p className="mt-1.5 text-sm font-medium">{nextGoalSkill.skill.title}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-4 sm:px-6">
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                    {completed ? "Review journey" : "Continue journey"}
                  </span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </article>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
