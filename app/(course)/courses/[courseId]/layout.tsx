import { courseService } from "@/services/course.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { progressService } from "@/services/progress.service";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2, PlayCircle } from "lucide-react";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const course = await courseService.getById(courseId, user);
  const progress = await progressService.getProgress(user.id, courseId);
  const completedSet = new Set(progress.filter((p) => p.completed).map((p) => p.chapter));

  const total = course.outline.chapters.length;
  const progressPercentage = Math.round((completedSet.size / total) * 100);

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505]">
      {/* Immersive Sidebar */}
      <aside className="w-80 border-r border-white/5 bg-[#0A0A0A] flex flex-col">
        <div className="p-6 border-b border-white/5">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-primary">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Library
            </Button>
          </Link>
          <h2 className="font-bold text-xl tracking-tight text-white line-clamp-2">{course.title}</h2>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span>Progress</span>
              <span className="text-primary">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5" />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {course.outline.chapters.map((chapter, index) => {
            const isDone = completedSet.has(index);
            return (
              <Link key={index} href={`/courses/${course.id}/${index}`}>
                <div className={`group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 ${
                  isDone ? "bg-primary/5 border border-primary/10" : "hover:bg-white/5 border border-transparent"
                }`}>
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <PlayCircle className="w-5 h-5 text-muted-foreground group-hover:text-white" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${isDone ? "text-primary/90" : "text-gray-300"}`}>
                      {index + 1}. {chapter.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-1">
                      {chapter.durationMinutes} mins
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_40%)]">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}