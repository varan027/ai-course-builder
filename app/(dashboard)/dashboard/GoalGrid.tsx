"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { GoalWithMeta } from "./page";
import { ArrowRight, CheckCircle2, Circle, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GoalGridProps {
  courses: GoalWithMeta[];
}

export default function GoalGrid({ courses }: GoalGridProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
      className="grid grid-cols-1 gap-5 lg:grid-cols-2"
    >
      {courses.map((goal) => {
        const nextSkill = goal.roadmap.skills?.[goal.nextSkillIndex];
        const isComplete = goal.progressPercent === 100;

        return (
          <motion.div
            key={goal.id}
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          >
            <Link href={`/courses/${goal.id}`} className="group block h-full">
              <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d0d] transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#101010]">
                <div className="p-7 md:p-8">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        <Target className="h-3.5 w-3.5" />
                        Learning path
                      </div>
                      <h3 className="text-2xl font-semibold tracking-tight">{goal.title}</h3>
                    </div>
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-white/20" />
                    )}
                  </div>

                  <div className="mt-8">
                    <div className="mb-3 flex justify-between text-sm">
                      <span className="text-muted-foreground">Skill journey</span>
                      <span className="font-medium">{goal.progressPercent}%</span>
                    </div>
                    <Progress value={goal.progressPercent} className="h-2" />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Skills</div>
                      <div className="mt-2 text-xl font-semibold">{goal.totalSkills}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Mastered</div>
                      <div className="mt-2 text-xl font-semibold">{goal.masteredSkills}</div>
                    </div>
                  </div>

                  {nextSkill && !isComplete && (
                    <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/[0.06] p-5">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Up next</div>
                      <div className="mt-2 font-medium">{nextSkill.title}</div>
                      <div className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {nextSkill.milestone ?? nextSkill.description}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-white/5 px-7 py-4 md:px-8">
                  <span className="text-sm text-muted-foreground">{isComplete ? "Review path" : "Continue learning"}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}