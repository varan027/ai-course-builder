import { goalService } from "@/services/goal.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { progressService } from "@/services/progress.service";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
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

  if (!user) redirect("/login");

  const goal = await goalService.getById(courseId, user.id);
  const progress = await progressService.getProgress(user.id, courseId);
  const completedSet = new Set(
    progress.filter((p) => p.status === "MASTERED").map((p) => p.goalSkillId),
  );
  const totalSkills = goal.goalSkills.length;
  const completedCount = completedSet.size;
  const progressPercentage = totalSkills ? Math.round((completedCount / totalSkills) * 100) : 0;
  const nextGoalSkill = goal.goalSkills.find((goalSkill) => !completedSet.has(goalSkill.id));

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      <aside className="border-b border-white/[0.07] bg-[#080808] lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-[280px] lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex flex-col lg:h-full">
          <div className="border-b border-white/[0.06] px-5 py-5 sm:px-6 lg:px-5">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg px-1 py-1 text-xs text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ArrowLeft className="size-3.5" />
              Dashboard
            </Link>

            <div className="mt-7">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Learning journey
              </p>
              <h2 className="mt-2 text-lg font-semibold leading-tight tracking-tight">{goal.title}</h2>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Mastery</span>
                <span className="font-medium">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-1" />
              <p className="mt-2 text-[11px] text-muted-foreground">
                {completedCount} of {totalSkills} skills mastered
              </p>
            </div>
          </div>

          <div className="px-3 py-4 lg:flex-1 lg:overflow-y-auto">
            <div className="mb-3 flex items-center justify-between px-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Skills
              </p>
              {nextGoalSkill && (
                <span className="text-[10px] text-primary">Next up</span>
              )}
            </div>
            <SidebarNav courseId={courseId} goalSkills={goal.goalSkills} completedSet={completedSet} />
          </div>

          {completedCount > 0 && completedCount === totalSkills && (
            <div className="hidden border-t border-white/[0.06] px-5 py-4 lg:block">
              <div className="flex items-center gap-2 text-xs text-primary">
                <CheckCircle2 className="size-4" />
                Journey mastered
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="min-w-0 flex-1 lg:ml-[280px]">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
          {children}
        </div>
      </main>
    </div>
  );
}
