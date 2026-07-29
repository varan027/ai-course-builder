"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { GoalWithMeta } from "./page";
import { ArrowRight, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GoalGridProps {
  courses: GoalWithMeta[];
}

export default function GoalGrid({
  courses,
}: GoalGridProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.06,
          },
        },
      }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {courses.map((goal) => {
        const nextSkill =
          goal.roadmap.skills?.[0];

        return (
          <motion.div
            key={goal.id}
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
          >
            <Link
              href={`/courses/${goal.id}`}
              className="group block h-full"
            >
              <div className="h-full rounded-3xl border border-white/10 bg-[#0c0c0c] hover:border-white/20 transition-all duration-300 overflow-hidden">
                <div className="p-8 space-y-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
                        Goal
                      </p>

                      <h3 className="text-2xl font-semibold tracking-tight leading-tight">
                        {goal.title}
                      </h3>
                    </div>

                    <Target className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-muted-foreground">
                        Progress
                      </span>

                      <span className="font-medium">
                        {goal.progressPercent}%
                      </span>
                    </div>

                    <Progress
                      value={goal.progressPercent}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                        Skills
                      </p>

                      <p className="text-2xl font-semibold">
                        {goal.totalSkills}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                        Status
                      </p>

                      <p className="text-sm font-medium">
                        {goal.progressPercent === 100
                          ? "Completed"
                          : "In Progress"}
                      </p>
                    </div>
                  </div>

                  {nextSkill && (
                    <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5">
                      <p className="text-[10px] uppercase tracking-widest text-primary mb-2">
                        Next Skill
                      </p>

                      <p className="font-medium">
                        {nextSkill.title}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/5 px-8 py-5 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Continue Journey
                  </span>

                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}