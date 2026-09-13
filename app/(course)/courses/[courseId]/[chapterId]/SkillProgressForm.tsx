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
};

export default function SkillProgressForm({
  goalId,
  goalSkillId,
  currentStatus,
}: SkillProgressFormProps) {
  const [state, formAction, isPending] = useActionState(advanceSkill, {});
  const label = getSkillActionLabel(currentStatus);
  const isMastered = currentStatus === "MASTERED";

  if (isMastered) return null;

  return (
    <div className="flex flex-col items-start">
      <form action={formAction}>
        <input type="hidden" name="goalId" value={goalId} />
        <input type="hidden" name="goalSkillId" value={goalSkillId} />
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="h-12 rounded-full px-6 font-medium shadow-none"
        >
          {isPending ? "Saving..." : label}
          {!isPending && <ArrowRight className="size-4" />}
        </Button>
      </form>
      {state?.error && <p className="mt-3 text-sm text-red-400">{state.error}</p>}
    </div>
  );
}
