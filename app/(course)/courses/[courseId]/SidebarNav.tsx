"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Circle, ArrowRight } from "lucide-react";
import type { Skill } from "@/lib/ai/schema";

interface SidebarNavProps {
  courseId: string;
  skills: Skill[];
  completedSet: Set<string>;
}

export default function SidebarNav({
  courseId,
  skills,
  completedSet,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <ul className="space-y-3">
      {skills.map((skill, index) => {
        const href = `/courses/${courseId}/${index}`;

        const isDone = completedSet.has(skill.id);

        const isActive = pathname === href;

        return (
          <li key={skill.id}>
            <Link
              href={href}
              className={`
                group
                block
                rounded-2xl
                border
                transition-all
                duration-300
                ${
                  isActive
                    ? "border-primary/30 bg-primary/10"
                    : "border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                }
              `}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isDone ? (
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-black">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs uppercase tracking-widest mb-2 ${
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      Skill {index + 1}
                    </p>

                    <h4
                      className={`font-medium leading-snug ${
                        isActive
                          ? "text-white"
                          : "text-white/90"
                      }`}
                    >
                      {skill.title}
                    </h4>

                    {skill.dependsOn.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2 truncate">
                        Depends on {skill.dependsOn.join(", ")}
                      </p>
                    )}
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-all ${
                      isActive
                        ? "text-primary translate-x-1"
                        : "text-muted-foreground group-hover:translate-x-1"
                    }`}
                  />
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}