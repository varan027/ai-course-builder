"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";

interface SidebarNavProps {
  courseId: string;
  chapters: any[];
  completedSet: Set<number>;
}

export default function SidebarNav({
  courseId,
  chapters,
  completedSet,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <ul className="space-y-2">
      {chapters.map((chapter, index) => {
        const isDone = completedSet.has(index);
        const href = `/courses/${courseId}/${index}`;
        const isActive = pathname === href;

        return (
          <li key={index}>
            <Link
              href={href}
              className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 border hover:translate-x-1 ${
                isActive
                  ? "bg-primary/10 text-primary border-primary/30 font-medium"
                  : isDone
                    ? "bg-primary/5 text-white border-transparent hover:bg-primary/10"
                    : "text-muted-foreground hover:bg-white/5 border-transparent hover:text-white"
              }`}
            >
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm truncate">
                  {index + 1}. {chapter.title}
                </span>
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? "text-primary/70" : "text-muted-foreground"
                  }`}
                >
                  {chapter.durationMinutes} mins
                </span>
              </div>

              {isDone && (
                <div
                  className={`flex items-center justify-center w-5 h-5 shrink-0 rounded-full ${
                    isActive
                      ? "bg-primary text-black"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  <Check className="w-3 h-3" />
                </div>
              )}
            </Link>
          </li>
        );
      })}

      <div className="p-4 border-t border-white/5 text-xs text-muted-foreground">
        {completedSet.size} of {chapters.length} completed
      </div>
    </ul>
  );
}
