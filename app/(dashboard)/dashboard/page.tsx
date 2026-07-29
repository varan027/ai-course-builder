import { logout } from "@/actions/logout";
import { getCurrentUser } from "@/lib/auth";
import { goalService } from "@/services/goal.service";
import { progressService } from "@/services/progress.service";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import CourseGrid from "./GoalGrid";

export type GoalWithMeta = {
  id: string;
  title: string;
  roadmap: any;
  totalSkills: number;
  progressPercent: number;
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const goals = await goalService.getAllForUser(user);

  const goalsWithMeta: GoalWithMeta[] = await Promise.all(
    goals.map(async (goal) => {
      const progress = await progressService.getProgress(
        user.id,
        goal.id
      );

      const masteredCount = progress.filter(
        (p) => p.status === "MASTERED"
      ).length;

      const totalSkills = goal.roadmap.skills.length;

      return {
        id: goal.id,
        title: goal.title,
        roadmap: goal.roadmap,
        totalSkills,
        progressPercent:
          totalSkills > 0
            ? Math.round(
                (masteredCount / totalSkills) * 100
              )
            : 0,
      };
    })
  );

  const currentGoal = goalsWithMeta[0];

  const nextSkill =
    currentGoal?.roadmap?.skills?.find(
      (skill: any) =>
        !(
          currentGoal.progressPercent === 100
        )
    ) ?? currentGoal?.roadmap?.skills?.[0];

  const totalSkills = goalsWithMeta.reduce(
    (sum, goal) => sum + goal.totalSkills,
    0
  );

  const masteredSkills = goalsWithMeta.reduce(
    (sum, goal) =>
      sum +
      Math.round(
        (goal.progressPercent / 100) *
          goal.totalSkills
      ),
    0
  );

  return (
    <div className="min-h-screen bg-[#050505]">
      <header className="border-b border-white/10 bg-[#0b0b0b]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <div>
              <div className="text-white font-semibold tracking-tight">
                Syllarc
              </div>

              <div className="text-xs text-muted-foreground">
                Learning Operating System
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/create-goal">
              <Button
                variant="ghost"
                className="text-muted-foreground"
              >
                New Goal
              </Button>
            </Link>

            <form action={logout}>
              <Button variant="ghost">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <section className="rounded-3xl border border-white/10 bg-linear-to-b from-[#111111] to-[#0c0c0c] p-10">
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Current Goal
              </p>

              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mt-4">
                {currentGoal?.title ?? "Create your first goal"}
              </h1>
            </div>

            <div className="max-w-md space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>

                <span>
                  {currentGoal?.progressPercent ?? 0}%
                </span>
              </div>

              <Progress
                value={currentGoal?.progressPercent ?? 0}
              />
            </div>

            {currentGoal && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Next Skill
                  </p>

                  <p className="text-2xl font-medium mt-3">
                    {nextSkill?.title}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Project Challenge
                  </p>

                  <p className="text-2xl font-medium mt-3">
                    {nextSkill?.projectChallenge ??
                      "No challenge yet"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Goals
            </p>

            <p className="text-3xl font-semibold mt-3">
              {goals.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Skills
            </p>

            <p className="text-3xl font-semibold mt-3">
              {totalSkills}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Mastered
            </p>

            <p className="text-3xl font-semibold mt-3">
              {masteredSkills}
            </p>
          </div>
        </section>

        {goals.length === 0 ? (
          <section className="rounded-3xl border border-white/10 bg-[#0f0f0f] py-20 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Start Your First Learning Journey
            </h2>

            <p className="text-muted-foreground mb-8">
              Tell Syllarc what you want to become.
              We'll generate the roadmap.
            </p>

            <Link href="/create-goal">
              <Button>
                Create Goal
              </Button>
            </Link>
          </section>
        ) : (
          <section>
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Your Roadmaps
              </p>
            </div>

            <CourseGrid courses={goalsWithMeta} />
          </section>
        )}
      </main>
    </div>
  );
}