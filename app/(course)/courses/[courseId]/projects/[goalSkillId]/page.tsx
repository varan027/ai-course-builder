import { ArrowLeft, CheckCircle2, Hammer, Target } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { goalService } from "@/services/goal.service";
import { progressService } from "@/services/progress.service";
import { getProjectProofState } from "@/lib/project-proof";
import { Button } from "@/components/ui/button";
import StartProjectForm from "./StartProjectForm";
import { SkillStatus } from "@prisma/client";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ courseId: string; goalSkillId: string }>;
}) {
  const { courseId, goalSkillId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const goal = await goalService.getById(courseId, user.id);
  const goalSkill = goal.goalSkills.find((skill) => skill.id === goalSkillId);
  if (!goalSkill) notFound();

  const progress = await progressService.getProgress(user.id, courseId);
  const skillProgress = progress.find((item) => item.goalSkillId === goalSkill.id);
  const skillStatus = skillProgress?.status ?? SkillStatus.NOT_STARTED;
  const started = Boolean(skillProgress?.projectStartedAt);
  const projectState = getProjectProofState(skillStatus, started);

  if (projectState === "LOCKED") {
    redirect(`/courses/${courseId}/${goalSkill.position}`);
  }

  return (
    <article className="animate-in fade-in duration-500">
      <header className="border-b border-white/[0.07] pb-10 sm:pb-12">
        <Link
          href={`/courses/${courseId}/${goalSkill.position}`}
          className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to skill
        </Link>

        <div className="mt-9 flex items-center gap-2">
          <Hammer className="size-4 text-primary" />
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Build to prove it
          </p>
        </div>

        <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
          {goalSkill.projectChallenge}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Turn what you just learned into something you can show, run, or explain.
        </p>
      </header>

      <div className="space-y-5 py-9 sm:py-10">
        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Target className="size-4 text-primary" />
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              What this proves
            </p>
          </div>
          <h2 className="mt-4 text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
            {goalSkill.skill.title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/90 sm:text-base">
            {goalSkill.milestone}
          </p>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Definition of done
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground/90 sm:text-base">
            Build the smallest working version that demonstrates the challenge above. Focus on a working result over polish, then keep the project as evidence of your new skill.
          </p>

          <div className="mt-7 border-t border-white/[0.07] pt-6">
            {projectState === "READY" ? (
              <StartProjectForm goalId={courseId} goalSkillId={goalSkill.id} />
            ) : (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-primary" />
                Project started. Build it, test it, and keep the result as evidence of mastery.
              </div>
            )}
          </div>
        </section>
      </div>
    </article>
  );
}
