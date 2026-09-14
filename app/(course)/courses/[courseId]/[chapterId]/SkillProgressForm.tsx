"use client";

import { useActionState } from "react";
import { advanceSkill } from "@/actions/advancceSkill";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getSkillActionLabel, type ProgressStage } from "@/lib/course-learning";

type SkillProgressFormProps = {
  goalId: string;
  goalSkillId: string;
  currentStatus: ProgressStage;
  skillTitle?: string;
  masteryProof?: {
    task: string;
    proofType: string;
  } | null;
};

export default function SkillProgressForm({
  goalId,
  goalSkillId,
  currentStatus,
  skillTitle = "this skill",
  masteryProof = null,
}: SkillProgressFormProps) {
  const [state, formAction, isPending] = useActionState(advanceSkill, {});
  const label = getSkillActionLabel(currentStatus);
  const isMastered = currentStatus === "MASTERED";
  const requiresProof = currentStatus === "APPLYING";

  if (isMastered) return null;

  if (requiresProof && !masteryProof) {
    return (
      <div className="w-full max-w-xl rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5 sm:p-6">
        <p className="text-sm font-semibold">Mastery evidence is unavailable</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          This skill belongs to an older learning journey without an evidence checkpoint. Create a new goal to use evidence-based mastery.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl">
      {requiresProof && masteryProof ? (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary" />
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Prove your understanding</p>
          </div>
          <p className="mt-4 text-base font-medium leading-7 text-foreground">{masteryProof.task}</p>
          <p className="mt-3 text-xs text-muted-foreground">Show what you can do with the skill. Different valid approaches are welcome.</p>
        </div>
      ) : null}

      <form action={formAction} className="mt-5 space-y-4">
        <input type="hidden" name="goalId" value={goalId} />
        <input type="hidden" name="goalSkillId" value={goalSkillId} />
        {requiresProof && (
          <textarea
            name="proofAnswer"
            required
            rows={7}
            placeholder={`Show how you would apply ${skillTitle}...`}
            className="w-full resize-y rounded-2xl border border-white/[0.08] bg-white/[0.018] px-4 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
          />
        )}
        <Button type="submit" size="lg" disabled={isPending} className="h-12 rounded-full px-6 font-medium shadow-none">
          {isPending ? "Evaluating evidence..." : requiresProof ? "Submit evidence" : label}
          {!isPending && <ArrowRight className="size-4" />}
        </Button>
      </form>

      {state?.feedback && (
        <div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5">
          <p className="text-sm leading-6 text-foreground/90">{state.feedback}</p>
          {state.retryGuidance && <p className="mt-3 text-sm leading-6 text-muted-foreground">{state.retryGuidance}</p>}
        </div>
      )}
      {state?.error && <p className="mt-3 text-sm text-red-400">{state.error}</p>}
    </div>
  );
}
