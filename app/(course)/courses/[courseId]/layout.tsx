import { courseService } from "@/services/course.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { progressService } from "@/services/progress.service";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import SidebarNav from "../[courseId]/SidebarNav";

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
  
  const completedSet = new Set(
    progress.filter((p) => p.completed).map((p) => p.chapter),
  );

  const total = course.outline.chapters.length;
  const completedCount = completedSet.size;
  const progressPercentage = Math.round((completedCount / total) * 100);

  return (
    <div className="flex min-h-screen bg-[#050505]">
      <aside className="w-80 border-r border-white/5 bg-[#0A0A0A] flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-white/5">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" /> Library
            </Button>
          </Link>
          <h2 className="font-bold text-lg text-white line-clamp-2 mb-4 leading-tight">{course.title}</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              <span>Progress</span>
              <span className="text-primary">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5 bg-white/5" />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {/* Use the new Client Component here */}
          <SidebarNav 
            courseId={courseId} 
            chapters={course.outline.chapters} 
            completedSet={completedSet} 
          />
        </nav>
      </aside>

      <main className="flex-1 ml-80 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent_40%)]">
        <div className="max-w-4xl mx-auto px-12 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}