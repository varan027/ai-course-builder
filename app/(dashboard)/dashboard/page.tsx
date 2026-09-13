import { logout } from "@/actions/logout";
import { getCurrentUser } from "@/lib/auth";
import { goalService } from "@/services/goal.service";
import { progressService } from "@/services/progress.service";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, BookOpen, Flame, Plus, Sparkles, Target, Trophy } from "lucide-react";
import CourseGrid from "./GoalGrid";

export type GoalWithMeta = {
  id: string;
  title: string;
  roadmap: any;
  totalSkills: number;
  masteredSkills: number;
  progressPercent: number;
  nextSkillIndex: number;
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const goals = await goalService.getAllForUser(user);

  const goalsWithMeta: GoalWithMeta[] = await Promise.all(
    goals.map(async (goal) => {
      const progress = await progressService.getProgress(user.id, goal.id);
      const masteredIds = new Set(
        progress.filter((item) => item.status === "MASTERED").map((item) => item.skillId),
      );
      const skills = goal.roadmap.skills ?? [];
      const masteredSkills = skills.filter((skill: any) => masteredIds.has(skill.id)).length;
      const nextSkillIndex = Math.max(
        0,
        skills.findIndex((skill: any) => !masteredIds.has(skill.id)),
      );

      return {
        id: goal.id,
        title: goal.title,
        roadmap: goal.roadmap,
        totalSkills: skills.length,
        masteredSkills,
        progressPercent: skills.length ? Math.round((masteredSkills / skills.length) * 100) : 0,
        nextSkillIndex,
      };
    }),
  );

  const currentGoal = goalsWithMeta[0];
  const totalSkills = goalsWithMeta.reduce((sum, goal) => sum + goal.totalSkills, 0);
  const masteredSkills = goalsWithMeta.reduce((sum, goal) => sum + goal.masteredSkills, 0);
  const overallPercent = totalSkills ? Math.round((masteredSkills / totalSkills) * 100) : 0;
  const nextSkill = currentGoal?.roadmap?.skills?.[currentGoal.nextSkillIndex];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050505]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/dashboard" className="group">
            <div className="font-semibold tracking-tight">Syllarc</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Learning OS</div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/create-goal">
              <Button className="rounded-full px-4">
                <Plus className="mr-2 h-4 w-4" />
                New goal
              </Button>
            </Link>
            <form action={logout}>
              <Button variant="ghost" className="text-muted-foreground hover:text-white">Log out</Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8 md:py-12">
        <section className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#151515] via-[#101010] to-[#0a0a0a] p-7 md:p-10">
            <div className="mb-10 flex items-start justify-between gap-6">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <Sparkles className="h-3 w-3" />
                  Today’s focus
                </div>
                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
                  {currentGoal ? `Keep moving toward ${currentGoal.title}.` : "Build your first learning path."}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  {currentGoal
                    ? "Your next action is ready. Learn with intent, practice immediately, and turn each skill into something you can actually build."
                    : "Tell Syllarc what you want to become and get a structured path from first principles to real projects."}
                </p>
              </div>
              <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:block">
                <Flame className="h-5 w-5" />
              </div>
            </div>

            {currentGoal && nextSkill ? (
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div className="rounded-2xl border border-primary/20 bg-primary/[0.07] p-5">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary">
                    <BookOpen className="h-4 w-4" />
                    Next skill
                  </div>
                  <div className="text-xl font-medium">{nextSkill.title}</div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{nextSkill.milestone ?? nextSkill.description}</p>
                </div>
                <Link href={`/courses/${currentGoal.id}/${currentGoal.nextSkillIndex}`}>
                  <Button size="lg" className="h-14 rounded-2xl px-7">
                    Start learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/create-goal">
                <Button size="lg" className="h-14 rounded-2xl px-7">
                  Create your first goal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#0d0d0d] p-7">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Overall progress</div>
                <div className="mt-2 text-4xl font-semibold tracking-tight">{overallPercent}%</div>
              </div>
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <Progress value={overallPercent} className="h-2" />
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <Target className="mb-3 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-semibold">{goals.length}</div>
                <div className="text-xs text-muted-foreground">Goals</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <BookOpen className="mb-3 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-semibold">{masteredSkills}</div>
                <div className="text-xs text-muted-foreground">Skills mastered</div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Your learning paths</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Keep building momentum</h2>
            </div>
            {goals.length > 0 && (
              <Link href="/create-goal" className="text-sm text-muted-foreground transition hover:text-white">Create another →</Link>
            )}
          </div>

          {goals.length ? (
            <CourseGrid courses={goalsWithMeta} />
          ) : (
            <div className="rounded-[32px] border border-dashed border-white/15 bg-white/[0.02] px-6 py-20 text-center">
              <Sparkles className="mx-auto mb-5 h-6 w-6 text-primary" />
              <h3 className="text-2xl font-semibold">A goal is all you need to start.</h3>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Syllarc will turn a destination into a practical sequence of skills, projects, resources, and mastery checkpoints.</p>
              <Link href="/create-goal" className="mt-8 inline-block">
                <Button size="lg" className="rounded-2xl">Create learning path</Button>
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}