import { goalService } from "@/services/goal.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { progressService } from "@/services/progress.service";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Trophy,
  Target,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import SkillProgressForm from "./SkillProgressForm";

export default async function SkillPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { courseId, chapterId } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const goal = await goalService.getById(courseId, user.id);

  const index = Number(chapterId);

  const goalSkill = goal.goalSkills[index];

  if (!goalSkill) {
    redirect(`/courses/${courseId}/0`);
  }

  const progress = await progressService.getProgress(user.id, courseId);

  const skillProgress = progress.find((p) => p.goalSkillId === goalSkill.id);

  const currentStatus = skillProgress?.status ?? "NOT_STARTED";

  const isCompleted = currentStatus === "MASTERED";

  const statusLabel = currentStatus.replace("_", " ");

  const progressionStages = [
    "NOT_STARTED",
    "EXPLORING",
    "PRACTICING",
    "APPLYING",
    "MASTERED",
  ] as const;

  const currentStageIndex = progressionStages.indexOf(currentStatus);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-[0.2em]">
            Skill {index + 1}
          </span>

          {isCompleted && (
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs uppercase tracking-[0.2em]">
              Mastered
            </span>
          )}
        </div>

        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6">
          {goalSkill.skill.title}
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
          {goalSkill.whyImportant}
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-[#0f0f0f] p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Progress
            </p>

            <p className="text-sm text-primary font-medium">{statusLabel}</p>
          </div>

          <div className="flex items-center gap-2">
            {progressionStages.map((stage, stageIndex) => {
              const isReached = stageIndex <= currentStageIndex;

              return (
                <div key={stage} className="flex-1">
                  <div
                    className={`h-2 rounded-full ${
                      isReached ? "bg-primary" : "bg-white/10"
                    }`}
                  />

                  <p
                    className={`mt-2 text-[10px] uppercase tracking-wider ${
                      isReached ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {stage.replace("_", " ")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <div className="rounded-3xl border border-white/10 bg-[#0f0f0f] p-8">
          <Lightbulb className="w-5 h-5 mb-4 text-primary" />

          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Understanding
          </p>

          <p className="leading-relaxed text-white/90">
            {goalSkill.description}
          </p>
        </div>

        <div className="rounded-3xl border border-primary/10 bg-primary/5 p-8">
          <Target className="w-5 h-5 mb-4 text-primary" />

          <p className="text-xs uppercase tracking-widest text-primary mb-4">
            Milestone
          </p>

          <p className="text-lg font-medium leading-relaxed">
            {goalSkill.milestone}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#111111] p-8 mb-10">
        <div className="flex items-center gap-3 mb-5">
          <Trophy className="w-5 h-5 text-primary" />

          <p className="text-xs uppercase tracking-widest text-primary">
            Project Challenge
          </p>
        </div>

        <p className="text-lg leading-relaxed text-white/90">
          {goalSkill.projectChallenge}
        </p>
      </div>

      {goalSkill.dependencies.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-[#0f0f0f] p-8 mb-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Prerequisites
          </p>

          <div className="flex flex-wrap gap-3">
            {goalSkill.dependencies.map((dependency) => {
              const isPrerequisiteMastered =
                dependency.prerequisiteGoalSkill.progress.some(
                  (p) => p.status === "MASTERED",
                );

              return (
                <div
                  key={dependency.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${
                    isPrerequisiteMastered
                      ? "bg-green-500/5 border-green-500/10"
                      : "bg-white/5 border-white/5"
                  }`}
                >
                  {isPrerequisiteMastered ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-white/20" />
                  )}

                  <span className="text-sm">
                    {dependency.prerequisiteGoalSkill.skill.title}
                  </span>
                </div>
              );
            })}
            {goalSkill.dependencies.some(
              (dependency) =>
                !dependency.prerequisiteGoalSkill.progress.some(
                  (p) => p.status === "MASTERED",
                ),
            ) && (
              <p className="mt-5 text-sm text-muted-foreground ">
                Complete all prerequisites before advancing this skill.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Learning Resource
        </p>
      </div>

      {/* <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 bg-black mb-14">
        {skill.youtubeVideoId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${skill.youtubeVideoId}?rel=0`}
            title={skill.title}
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Resource unavailable
          </div>
        )}
      </div> */}

      <div className="border-t border-white/10 pt-10">
        <div className="flex flex-col items-center gap-6">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-[0.2em]">
            {statusLabel}
          </span>

          <SkillProgressForm
            goalId={courseId}
            goalSkillId={goalSkill.id}
            currentStatus={currentStatus}
          />

          <div className="flex justify-between w-full">
            {index > 0 ? (
              <Link href={`/courses/${courseId}/${index - 1}`}>
                <Button variant="ghost">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {index < goal.goalSkills.length - 1 && (
              <Link href={`/courses/${courseId}/${index + 1}`}>
                <Button variant="ghost">
                  Continue Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
