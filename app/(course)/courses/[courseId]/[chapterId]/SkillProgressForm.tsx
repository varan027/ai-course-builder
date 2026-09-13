"use client";

import { useActionState } from "react";
import { advanceSkill } from "@/actions/advancceSkill";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getSkillActionLabel, type ProgressStage } from "@/lib/course-learning";

type SkillProgressFormProps = {
  goalId: string;
  goalSkillId: string;
  currentStatus: ProgressStage;
  skillTitle?: string;
  practice?: string;
};

export default function SkillProgressForm({
  goalId,
  goalSkillId,
  currentStatus,
  skillTitle = "this skill",
  practice = "",
}: SkillProgressFormProps) {
  const [state, formAction, isPending] = useActionState(advanceSkill, {});
  const label = getSkillActionLabel(currentStatus);
  const isMastered = currentStatus === "MASTERED";
  const requiresProof = currentStatus === "APPLYING";

  if (isMastered) return null;

  return (
    <div className="w-full max-w-xl">
      {requiresProof ? (
        <div className="mb-5 rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5 sm:p-6">
          <div>
            <p className="text-sm font-semibold tracking-[-0.01em]">Prove your understanding</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Before mastering {skillTitle}, explain how you would apply it in practice.
            </p>
            {practice && (
              <p className="mt-4 border-l border-primary/40 pl-4 text-sm leading-6 text-foreground/80">
                {practice}
              </p>
            )}
          </div>
        </div>
      ) : null}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="goalId" value={goalId} />
        <input type="hidden" name="goalSkillId" value={goalSkillId} />
        {requiresProof && (
          <textarea
            name="proofAnswer"
            required
            minLength={30}
            rows={5}
            placeholder="Explain what you would do, why you would do it, and what result you would expect."
            className="w-full resize-y rounded-2xl border border-white/[0.08] bg-white/[0.018] px-4 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
          />
        )}
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="h-12 rounded-full px-6 font-medium shadow-none"
        >
          {isPending ? "Saving..." : requiresProof ? "Submit proof" : label}
          {!isPending && <ArrowRight className="size-4" />}
        </Button>
      </form>
      {state?.error && <p className="mt-3 text-sm text-red-400">{state.error}</p>}
    </div>
  );
}
