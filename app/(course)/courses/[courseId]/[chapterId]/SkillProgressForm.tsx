"use client";

import { useActionState } from "react";
import { advanceSkill } from "@/actions/advancceSkill";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getSkillActionLabel, type ProgressStage } from "@/lib/course-learning";

type SkillProgressFormProps = {
  goalId: string;
  goalSkillId: string;
  chapterId?: string;
  currentStatus: ProgressStage;
};

export default function SkillProgressForm({
  goalId,
  goalSkillId,
  chapterId = "0",
  currentStatus,
}: SkillProgressFormProps) {
  const [state, formAction, isPending] = useActionState(advanceSkill, {});
  const label = getSkillActionLabel(currentStatus);

  if (currentStatus === "MASTERED" || currentStatus === "APPLYING") {
    return null;
  }

  return (
    <div className="w-full max-w-xl">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="goalId" value={goalId} />
        <input type="hidden" name="goalSkillId" value={goalSkillId} />
        <input type="hidden" name="chapterId" value={chapterId} />
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
