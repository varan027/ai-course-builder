import { getCurrentUser } from "@/lib/auth";
import { goalService } from "@/services/goal.service";
import { progressService } from "@/services/progress.service";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, CheckCircle2, CircleDashed, Target } from "lucide-react";
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
    skill: {
      title: string;
    };
  }[];
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const goals = await goalService.getAllForUser(user.id);

  const goalsWithMeta: GoalWithMeta[] = await Promise.all(
    goals.map(async (goal) => {
      const progress = await progressService.getProgress(user.id, goal.id);
      const masteredCount = progress.filter((p) => p.status === "MASTERED").length;
      const totalSkills = goal.goalSkills.length;
      const masteredIds = new Set(
        progress.filter((p) => p.status === "MASTERED").map((p) => p.goalSkillId),
      );

      return {
        id: goal.id,
        title: goal.title,
        goalSkills: goal.goalSkills.map((goalSkill) => ({
          id: goalSkill.id,
          position: goalSkill.position,
          projectChallenge: goalSkill.projectChallenge,
          mastered: masteredIds.has(goalSkill.id),
          skill: { title: goalSkill.skill.title },
        })),
        totalSkills,
        progressPercent:
          totalSkills > 0 ? Math.round((masteredCount / totalSkills) * 100) : 0,
      };
    }),
  );

  const currentGoal = goalsWithMeta[0];
  const totalSkills = goalsWithMeta.reduce((sum, goal) => sum + goal.totalSkills, 0);
  const nextSkill = currentGoal?.goalSkills.find((goalSkill) => !goalSkill.mastered);
  const masteredSkills = goalsWithMeta.reduce(
    (sum, goal) => sum + Math.round((goal.progressPercent / 100) * goal.totalSkills),
    0,
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Overview
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Your learning workspace
          </h1>
        </div>

        <Button asChild className="shrink-0">
          <Link href="/create-goal">
            New Goal
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                <Target className="size-4" />
                Current goal
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {currentGoal?.title ?? "Create your first goal"}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                {currentGoal
                  ? "Keep moving through your journey. Your next step is already waiting."
                  : "Tell Syllarc what you want to become and generate a personalized learning path."}
              </p>
            </div>

            {currentGoal && (
              <div className="text-right">
                <div className="text-3xl font-semibold tracking-tight">
                  {currentGoal.progressPercent}%
                </div>
                <div className="mt-1 text-xs text-muted-foreground">mastery</div>
              </div>
            )}
          </div>

          <div className="mt-8 max-w-2xl">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>Journey progress</span>
              <span>{currentGoal?.progressPercent ?? 0}%</span>
            </div>
            <Progress value={currentGoal?.progressPercent ?? 0} className="h-1.5" />
          </div>

          {currentGoal && (
            <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2">
              <div className="bg-[#0a0a0a] p-5">
                <p className="text-xs text-muted-foreground">Next skill</p>
                <p className="mt-2 text-base font-medium">{nextSkill?.skill.title ?? "Journey complete"}</p>
              </div>
              <div className="bg-[#0a0a0a] p-5">
                <p className="text-xs text-muted-foreground">Project challenge</p>
                <p className="mt-2 text-base font-medium">
                  {nextSkill?.projectChallenge ?? "Choose another goal to keep building"}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <CircleDashed className="size-4 text-muted-foreground" />
          <p className="mt-5 text-xs text-muted-foreground">Goals</p>
          <p className="mt-1 text-2xl font-semibold">{goals.length}</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <Target className="size-4 text-muted-foreground" />
          <p className="mt-5 text-xs text-muted-foreground">Skills</p>
          <p className="mt-1 text-2xl font-semibold">{totalSkills}</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <CheckCircle2 className="size-4 text-muted-foreground" />
          <p className="mt-5 text-xs text-muted-foreground">Mastered</p>
          <p className="mt-1 text-2xl font-semibold">{masteredSkills}</p>
        </div>
      </section>

      <section id="journeys" className="mt-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Learning journeys
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">Your roadmaps</h2>
          </div>
          {goals.length > 0 && (
            <span className="text-xs text-muted-foreground">{goals.length} active</span>
          )}
        </div>

        {goals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.015] px-6 py-14 text-center">
            <h3 className="text-lg font-semibold">Start your first learning journey</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Give Syllarc a goal. We&apos;ll turn it into a structured roadmap of skills and projects.
            </p>
            <Button asChild className="mt-6">
              <Link href="/create-goal">Create Goal</Link>
            </Button>
          </div>
        ) : (
          <GoalGrid courses={goalsWithMeta} />
        )}
      </section>
    </div>
  );
}
