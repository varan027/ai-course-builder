"use client";

import { useActionState } from "react";
import { advanceSkill } from "@/actions/advancceSkill";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

type SkillStatus =
  | "NOT_STARTED"
  | "EXPLORING"
  | "PRACTICING"
  | "APPLYING"
  | "MASTERED";

type SkillProgressFormProps = {
  goalId: string;
  goalSkillId: string;
  currentStatus: SkillStatus;
};

export default function SkillProgressForm({
  goalId,
  goalSkillId,
  currentStatus,
}: SkillProgressFormProps) {
  const [state, formAction, isPending] = useActionState(advanceSkill, {});

  const buttonLabels: Record<SkillStatus, string> = {
    NOT_STARTED: "Start Exploring",
    EXPLORING: "Start Practicing",
    PRACTICING: "Start Applying",
    APPLYING: "Master Skill",
    MASTERED: "Skill Mastered",
  };

  return (
    <div className="flex flex-col items-center">
      <form action={formAction}>
        <input type="hidden" name="goalId" value={goalId} />
        <input type="hidden" name="goalSkillId" value={goalSkillId} />

        <Button
          type="submit"
          size="lg"
          disabled={isPending || currentStatus === "MASTERED"}
          className="h-14 px-10 rounded-2xl font-medium"
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />

          {isPending ? "Advancing..." : buttonLabels[currentStatus]}
        </Button>
      </form>

      {state?.error && (
        <p className="mt-4 text-sm text-red-400 text-center">{state.error}</p>
      )}
    </div>
  );
}
