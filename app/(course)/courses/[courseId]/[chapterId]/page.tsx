import { goalService } from "@/services/goal.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { progressService } from "@/services/progress.service";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, Target, Trophy } from "lucide-react";
import Link from "next/link";
import SkillProgressForm from "./SkillProgressForm";
import { getNextSkillIndex, getProgressStageIndex, PROGRESS_STAGES } from "@/lib/course-learning";

export default async function SkillPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { courseId, chapterId } = await params;
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const goal = await goalService.getById(courseId, user.id);
  const index = Number(chapterId);
  const goalSkill = goal.goalSkills[index];

  if (!goalSkill) redirect(`/courses/${courseId}/0`);

  const progress = await progressService.getProgress(user.id, courseId);
  const skillProgress = progress.find((p) => p.goalSkillId === goalSkill.id);
  const currentStatus = skillProgress?.status ?? "NOT_STARTED";
  const isCompleted = currentStatus === "MASTERED";
  const currentStageIndex = getProgressStageIndex(currentStatus);
  const nextIndex = getNextSkillIndex(
    goal.goalSkills.map((skill) => ({
      mastered: progress.some(
        (p) => p.goalSkillId === skill.id && p.status === "MASTERED",
      ),
    })),
    index,
  );
  const statusLabel = currentStatus.replace("_", " ");

  return (
    <article className="animate-in fade-in duration-500">
      <header className="border-b border-white/[0.07] pb-10 sm:pb-12">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")} / {String(goal.goalSkills.length).padStart(2, "0")}
          </p>
          {isCompleted && (
            <span className="flex items-center gap-1.5 text-xs text-primary">
              <CheckCircle2 className="size-4" /> Mastered
            </span>
          )}
        </div>

        <h1 className="mt-7 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
          {goalSkill.skill.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          {goalSkill.whyImportant}
        </p>

        <div className="mt-9 flex items-center gap-3">
          {PROGRESS_STAGES.map((stage, stageIndex) => (
            <div key={stage} className="flex-1">
              <div className={`h-1 rounded-full ${stageIndex <= currentStageIndex ? "bg-primary" : "bg-white/[0.08]"}`} />
              <p className={`mt-2 hidden text-[9px] uppercase tracking-[0.14em] sm:block ${stageIndex <= currentStageIndex ? "text-primary" : "text-muted-foreground"}`}>
                {stage.replace("_", " ")}
              </p>
            </div>
          ))}
        </div>
      </header>

      <div className="space-y-5 py-9 sm:py-10">
        <section className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-6 sm:p-7">
            <Lightbulb className="size-4 text-primary" />
            <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Understanding</p>
            <p className="mt-3 text-sm leading-6 text-foreground/90">{goalSkill.description}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-6 sm:p-7">
            <Target className="size-4 text-primary" />
            <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Milestone</p>
            <p className="mt-3 text-sm font-medium leading-6">{goalSkill.milestone}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-6 sm:p-7">
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-primary" />
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Project challenge</p>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-foreground/90">{goalSkill.projectChallenge}</p>
        </section>

        {goalSkill.dependencies.length > 0 && (
          <section className="border-t border-white/[0.07] pt-7">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Prerequisites</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {goalSkill.dependencies.map((dependency) => {
                const mastered = dependency.prerequisiteGoalSkill.progress.some((p) => p.status === "MASTERED");
                return (
                  <span key={dependency.id} className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] px-3 py-2 text-xs text-muted-foreground">
                    {mastered ? <CheckCircle2 className="size-3.5 text-primary" /> : <span className="size-3.5 rounded-full border border-white/20" />}
                    {dependency.prerequisiteGoalSkill.skill.title}
                  </span>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <footer className="border-t border-white/[0.07] pt-7 pb-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Your progress</p>
            <p className="mt-1 text-sm text-muted-foreground">{statusLabel}</p>
          </div>

          {!isCompleted && (
            <SkillProgressForm
              goalId={courseId}
              goalSkillId={goalSkill.id}
              currentStatus={currentStatus}
            />
          )}
        </div>

        <div className="mt-7 flex items-center justify-between gap-4">
          {index > 0 ? (
            <Button asChild variant="ghost" className="rounded-full text-muted-foreground">
              <Link href={`/courses/${courseId}/${index - 1}`}><ArrowLeft className="size-4" />Previous</Link>
            </Button>
          ) : <div />}

          {isCompleted && nextIndex !== undefined && (
            <Button asChild className="rounded-full px-5">
              <Link href={`/courses/${courseId}/${nextIndex}`}>Next skill <ArrowRight className="size-4" /></Link>
            </Button>
          )}
        </div>
      </footer>
    </article>
  );
}
