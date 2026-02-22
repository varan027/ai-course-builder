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

        // This is the bulletproof check: does the current URL end with this index?
        const href = `/courses/${courseId}/${index}`;
        const isActive = pathname === href;

        return (
          <li key={index}>
            <Link
              href={href}
              className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 border hover:translate-x-1 ${
                isActive
                  ? "bg-primary/10 text-primary border-primary/30 font-medium"
                  : "..."
              }`}
            >
              <div className="flex flex-col min-w-0">
                <span className="text-sm truncate">
                  {index + 1}. {chapter.title}
                </span>
                <span
                  className={`text-[10px] font-medium ${isActive ? "text-primary/70" : "text-muted-foreground"}`}
                >
                  {chapter.durationMinutes} mins
                </span>
              </div>

              {isDone && (
                <Check
                  className={`w-4 h-4 shrink-0 ml-2 ${isActive ? "text-black" : "text-primary"}`}
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
