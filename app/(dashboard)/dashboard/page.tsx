import { logout } from "@/actions/logout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { courseService } from "@/services/course.service";
import { progressService } from "@/services/progress.service";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

const page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const courses = await courseService.getAllForUser(user);

  const totalModules = courses.reduce(
    (sum, course) => sum + course.outline.chapters.length,
    0,
  );

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_60%)] pointer-events-none" />
      {/* Minimal Header */}
      <header className="border-b border-white/10 bg-[#0b0b0b]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg tracking-tight">
            Syllarc
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
        <div className="p-12 rounded-3xl bg-linear-to-b from-[#111111] to-[#0c0c0c] border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
              <p className="text-muted-foreground">
                {courses.length} learning arcs • {totalModules} modules
              </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {await Promise.all(
              courses.map(async (course) => {
                const progress = await progressService.getProgress(
                  user.id,
                  course.id,
                );

                const completedCount = progress.filter(
                  (p) => p.completed,
                ).length;

                const total = course.outline.chapters.length;
                const progressPercent =
                  total > 0 ? Math.round((completedCount / total) * 100) : 0;

                return (
                  <Link
                    href={`/courses/${course.id}`}
                    key={course.id}
                    className="group"
                  >
                    <Card className="bg-[#121212] border border-white/10 hover:border-white/20 transition-all duration-200 rounded-2xl p-8 hover:scale-[1.01] hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
                      <CardHeader className="p-0 mb-6">
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                          {course.level}
                        </div>
                        <CardTitle className="text-xl font-semibold tracking-tight">
                          {course.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="p-0 space-y-6">
                        <p className="text-sm text-muted-foreground">
                          {total} Modules
                        </p>

                        {/* Premium Progress */}
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Completion</span>
                            <span className="text-white">
                              {progressPercent}%
                            </span>
                          </div>

                          <div className="w-full h-2.5 bg-[#181818] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-700 ease-out"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              }),
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default page;
