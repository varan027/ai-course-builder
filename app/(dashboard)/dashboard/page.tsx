import { getCurrentUser } from "@/lib/auth";
import { getNextLearningSkill } from "@/lib/dashboard-next-step";
import { goalService } from "@/services/goal.service";
import { progressService } from "@/services/progress.service";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CheckCircle2, CircleDashed, Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import GoalGrid from "./GoalGrid";

export type GoalWithMeta = {
  id: string;
  title: string;
  totalSkills: number;
  progressPercent: number;
  goalSkills: {
    id: string;
    position: number;
    projectChallenge: string;
    mastered: boolean;
    skill: { title: string };
  }[];
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const goals = await goalService.getAllForUser(user.id);
  const goalsWithMeta: GoalWithMeta[] = await Promise.all(
    goals.map(async (goal) => {
      const progress = await progressService.getProgress(user.id, goal.id);
      const mastered = new Set(
        progress.filter((p) => p.status === "MASTERED").map((p) => p.goalSkillId),
      );
      const totalSkills = goal.goalSkills.length;
      const masteredCount = mastered.size;

      return {
        id: goal.id,
        title: goal.title,
        goalSkills: goal.goalSkills.map((goalSkill) => ({
          id: goalSkill.id,
          position: goalSkill.position,
          projectChallenge: goalSkill.projectChallenge,
          mastered: mastered.has(goalSkill.id),
          skill: { title: goalSkill.skill.title },
        })),
        totalSkills,
        progressPercent: totalSkills ? Math.round((masteredCount / totalSkills) * 100) : 0,
      };
    }),
  );

  const currentGoal = goalsWithMeta[0];
  const nextSkill = currentGoal ? getNextLearningSkill(currentGoal.goalSkills) : undefined;
  const totalSkills = goalsWithMeta.reduce((sum, goal) => sum + goal.totalSkills, 0);
  const masteredSkills = goalsWithMeta.reduce(
    (sum, goal) => sum + goal.goalSkills.filter((skill) => skill.mastered).length,
    0,
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
      <header className="mb-12 flex items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Learning workspace
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            {currentGoal ? "Keep going." : "Start becoming."}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {currentGoal ? "One focused step at a time." : "Turn a goal into a path you can follow."}
          </p>
        </div>
        <Button asChild variant="outline" className="shrink-0 rounded-full px-4">
          <Link href="/create-goal">
            <Plus className="size-4" />
            <span className="hidden sm:inline">New goal</span>
            <span className="sm:hidden">New</span>
          </Link>
        </Button>
      </header>

      {currentGoal ? (
        <section className="relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-white/[0.025]">
          <div className="p-7 sm:p-10 lg:p-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
                <Target className="size-3.5" />
                Current journey
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
                {currentGoal.title}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                {nextSkill
                  ? "Your next step is ready. Pick up where the journey naturally continues."
                  : "You&apos;ve completed this journey. Take a moment to review what you built."}
              </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-2xl">
                <div className="flex items-end justify-between text-xs">
                  <span className="text-muted-foreground">Mastery</span>
                  <span className="font-medium">{currentGoal.progressPercent}%</span>
                </div>
                <Progress value={currentGoal.progressPercent} className="mt-3 h-1" />
              </div>

              <Button asChild size="lg" className="h-12 rounded-full px-6 font-medium shadow-none">
                <Link href={`/courses/${currentGoal.id}`}>
                  {nextSkill ? "Continue learning" : "Review journey"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {nextSkill && (
            <div className="border-t border-white/[0.07] px-7 py-6 sm:px-10 lg:px-12">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Next up
                  </p>
                  <p className="mt-1.5 text-lg font-medium tracking-tight">{nextSkill.skill.title}</p>
                </div>
                <p className="max-w-md text-sm leading-5 text-muted-foreground sm:text-right">
                  {nextSkill.projectChallenge}
                </p>
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="rounded-[28px] border border-dashed border-white/[0.12] px-6 py-16 text-center sm:px-10">
          <div className="mx-auto max-w-lg">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-primary">Your first journey</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">What do you want to become?</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Give Syllarc a goal and it will turn it into a structured path of skills and projects.
            </p>
            <Button asChild size="lg" className="mt-7 rounded-full px-6">
              <Link href="/create-goal">Create your first goal <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
        </section>
      )}

      <section className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-white/[0.07] py-5">
        <div className="flex items-center gap-2.5 text-sm">
          <CircleDashed className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground">Goals</span>
          <span className="font-medium">{goals.length}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <Target className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground">Skills</span>
          <span className="font-medium">{totalSkills}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <CheckCircle2 className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground">Mastered</span>
          <span className="font-medium">{masteredSkills}</span>
        </div>
      </section>

      <section id="journeys" className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Your journeys</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">Learning paths</h2>
          </div>
          {goals.length > 0 && <span className="text-xs text-muted-foreground">{goals.length} {goals.length === 1 ? "journey" : "journeys"}</span>}
        </div>

        {goals.length > 0 && <GoalGrid courses={goalsWithMeta} />}
      </section>
    </div>
  );
}
