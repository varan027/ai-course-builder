"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Circle, ArrowRight } from "lucide-react";

type SidebarNavProps = {
  courseId: string;
  goalSkills: {
    id: string;
    position: number;
    skill: { title: string };
    dependencies: {
      id: string;
      prerequisiteGoalSkill: { skill: { title: string } };
    }[];
  }[];
  completedSet: Set<string>;
};

export default function SidebarNav({ courseId, goalSkills, completedSet }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <ol className="space-y-1">
      {goalSkills.map((goalSkill, index) => {
        const href = `/courses/${courseId}/${index}`;
        const isDone = completedSet.has(goalSkill.id);
        const isActive = pathname === href;

        return (
          <li key={goalSkill.id}>
            <Link
              href={href}
              aria-current={isActive ? "step" : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary ${
                isActive
                  ? "bg-white/[0.06] text-foreground"
                  : "text-muted-foreground hover:bg-white/[0.035] hover:text-foreground"
              }`}
            >
              <span className="flex size-6 shrink-0 items-center justify-center">
                {isDone ? (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" />
                  </span>
                ) : isActive ? (
                  <span className="size-2 rounded-full bg-primary" />
                ) : (
                  <Circle className="size-4" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={`mt-0.5 block truncate text-sm ${isActive ? "font-medium" : ""}`}>
                  {goalSkill.skill.title}
                </span>
              </span>
              {isActive && <ArrowRight className="size-3.5 shrink-0 text-primary" />}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
