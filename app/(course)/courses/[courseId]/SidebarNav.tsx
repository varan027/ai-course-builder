"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Circle, ArrowRight } from "lucide-react";

type SidebarNavProps = {
  courseId: string;
  goalSkills: {
    id: string;
    position: number;
    skill: {
      title: string;
    };
    dependencies: {
      id: string;
      prerequisiteGoalSkill: {
        skill: {
          title: string;
        };
      };
    }[];
  }[];
  completedSet: Set<string>;
};

export default function SidebarNav({
  courseId,
  goalSkills,
  completedSet,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <ul className="space-y-3">
      {goalSkills.map((goalSkill, index) => {
        const href = `/courses/${courseId}/${index}`;

        const isDone = completedSet.has(goalSkill.id);

        const isActive = pathname === href;

        return (
          <li key={goalSkill.id}>
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
                      {goalSkill.skill.title}
                    </h4>

                    {goalSkill.dependencies.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2 truncate">
                        Depends on {" "}
                        {goalSkill.dependencies.map((dependency) => dependency.prerequisiteGoalSkill.skill.title).join(", ")}
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