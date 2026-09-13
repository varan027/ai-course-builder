"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Check, Circle, Lock } from "lucide-react";
import type { Skill } from "@/lib/ai/schema";

interface SidebarNavProps {
  courseId: string;
  skills: Skill[];
  completedSet: Set<string>;
}

export default function SidebarNav({ courseId, skills, completedSet }: SidebarNavProps) {
  const pathname = usePathname();

  const firstIncompleteIndex = Math.max(
    0,
    skills.findIndex((skill) => !completedSet.has(skill.id)),
  );

  return (
    <ul className="space-y-2.5">
      {skills.map((skill, index) => {
        const href = `/courses/${courseId}/${index}`;
        const isDone = completedSet.has(skill.id);
        const isActive = pathname === href;
        const isRecommended = index === firstIncompleteIndex && !isDone;
        const isLocked = index > firstIncompleteIndex && !isDone;

        return (
          <li key={skill.id}>
            <Link
              href={href}
              className={`group block rounded-2xl border transition-all duration-200 ${
                isActive
                  ? "border-primary/30 bg-primary/10"
                  : isRecommended
                    ? "border-white/15 bg-white/[0.035]"
                    : "border-white/5 hover:border-white/10 hover:bg-white/[0.025]"
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-black">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    ) : isLocked ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.02]">
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      </div>
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <p className={`text-[10px] uppercase tracking-[0.2em] ${isActive || isRecommended ? "text-primary" : "text-muted-foreground"}`}>
                        Skill {index + 1}
                      </p>
                      {isRecommended && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-primary">
                          Next
                        </span>
                      )}
                    </div>

                    <h4 className={`truncate font-medium leading-snug ${isActive ? "text-white" : "text-white/90"}`}>
                      {skill.title}
                    </h4>

                    {skill.dependsOn?.length > 0 && (
                      <p className="mt-2 truncate text-xs text-muted-foreground">
                        Prerequisite: {skill.dependsOn.join(", ")}
                      </p>
                    )}
                  </div>

                  <ArrowRight className={`mt-1 h-4 w-4 shrink-0 transition-all ${isActive || isRecommended ? "translate-x-1 text-primary" : "text-muted-foreground group-hover:translate-x-1"}`} />
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}