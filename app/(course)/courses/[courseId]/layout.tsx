import { goalService } from "@/services/goal.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { progressService } from "@/services/progress.service";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Target, Trophy } from "lucide-react";
import SidebarNav from "../[courseId]/SidebarNav";

export default async function GoalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const goal = await goalService.getById(courseId, user);

  const progress = await progressService.getProgress(
    user.id,
    courseId
  );

  const completedSet = new Set(
    progress
      .filter((p) => p.status === "MASTERED")
      .map((p) => p.skillId)
  );

  const totalSkills = goal.roadmap.skills.length;

  const completedCount = goal.roadmap.skills.filter(
    (skill) => completedSet.has(skill.id)
  ).length;

  const progressPercentage =
    totalSkills === 0
      ? 0
      : Math.round(
          (completedCount / totalSkills) * 100
        );

  const nextSkill = goal.roadmap.skills.find(
    (skill) => !completedSet.has(skill.id)
  );

  return (
    <div className="flex min-h-screen bg-[#050505]">
      <aside className="w-[360px] border-r border-white/10 bg-[#080808] fixed h-full overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-white/5">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="mb-6 text-muted-foreground"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Dashboard
              </Button>
            </Link>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
                  Goal
                </p>

                <h2 className="text-xl font-semibold leading-tight">
                  {goal.title}
                </h2>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-muted-foreground">
                    Journey Progress
                  </span>

                  <span className="font-medium text-primary">
                    {progressPercentage}%
                  </span>
                </div>

                <Progress
                  value={progressPercentage}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <Target className="w-4 h-4 mb-3 text-primary" />

                  <p className="text-xs text-muted-foreground mb-1">
                    Skills
                  </p>

                  <p className="text-xl font-semibold">
                    {totalSkills}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <Trophy className="w-4 h-4 mb-3 text-primary" />

                  <p className="text-xs text-muted-foreground mb-1">
                    Mastered
                  </p>

                  <p className="text-xl font-semibold">
                    {completedCount}
                  </p>
                </div>
              </div>

              {nextSkill && (
                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                  <p className="text-[10px] uppercase tracking-widest text-primary mb-2">
                    Next Skill
                  </p>

                  <p className="font-medium">
                    {nextSkill.title}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-5">
              Skill Journey
            </div>

            <SidebarNav
              courseId={courseId}
              skills={goal.roadmap.skills}
              completedSet={completedSet}
            />
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-[360px]">
        <div className="max-w-5xl mx-auto px-10 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}