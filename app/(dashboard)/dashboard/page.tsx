import { logout } from "@/actions/logout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { courseService } from "@/services/course.service";
import { progressService } from "@/services/progress.service";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CourseGrid from "./CourseGrid";

type CourseWithMeta = {
  id: string;
  title: string;
  level: string;
  outline: any;
  totalModules: number;
  progressPercent: number;
};

const page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const courses = await courseService.getAllForUser(user);

  const totalModules = courses.reduce(
    (sum, course) => sum + course.outline.chapters.length,
    0,
  );

  const coursesWithMeta: CourseWithMeta[] = await Promise.all(
    courses.map(async (course) => {
      const progress = await progressService.getProgress(user.id, course.id);

      const completedCount = progress.filter((p) => p.completed).length;
      const total = (course.outline as any).chapters.length;

      return {
        id: course.id,
        title: course.title,
        level: course.level,
        outline: course.outline,
        totalModules: total,
        progressPercent:
          total > 0 ? Math.round((completedCount / total) * 100) : 0,
      };
    }),
  );

  const completedCount = coursesWithMeta.filter(
    (c) => c.progressPercent === 100,
  ).length;

  const inProgressCount = coursesWithMeta.filter(
    (c) => c.progressPercent > 0 && c.progressPercent < 100,
  ).length;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_60%)] pointer-events-none" />
      {/* Minimal Header */}
      <header className="border-b border-white/10 bg-[#0b0b0b]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg tracking-tight">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold tracking-tight text-white">
                Syllarc
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Learning Architecture
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/create-course"
              className="text-sm text-muted-foreground hover:text-white transition-colors"
            >
              Generate
            </Link>

            <form action={logout}>
              <button className="text-sm text-muted-foreground hover:text-white transition-colors">
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="p-12 rounded-3xl bg-linear-to-b from-[#111111] to-[#0c0c0c] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">
                Learning Overview
              </h2>
              <div className="space-y-1">
                <p className="text-muted-foreground">
                  {courses.length} learning arcs • {totalModules} modules
                </p>
                <p className="text-sm text-muted-foreground">
                  {completedCount} completed • {inProgressCount} in progress
                </p>
              </div>
            </div>

            <Link href="/create-course">
              <Button className="h-11 px-6 rounded-xl font-medium">
                New Arc
              </Button>
            </Link>
          </div>
        </div>

        <div className="h-10" />

        {courses.length === 0 ? (
          <div className="py-20 text-center border border-white/10 rounded-3xl bg-[#0f0f0f]">
            <h3 className="text-xl font-semibold mb-2">No learning arcs yet</h3>
            <p className="text-muted-foreground mb-6">
              Generate your first structured curriculum.
            </p>
            <Link href="/create-course">
              <Button className="rounded-xl px-6 h-11">Create Course</Button>
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-6 text-sm text-muted-foreground uppercase tracking-widest">
              Your Arcs
            </div>
            <CourseGrid courses={coursesWithMeta} />
          </div>
        )}
      </main>
    </div>
  );
};

export default page;
