"use client";

import { useActionState } from "react";
import { advanceSkill } from "@/actions/advancceSkill";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

type SkillProgressFormProps = {
  goalId: string;
  goalSkillId: string;
  isCompleted: boolean;
};

export default function SkillProgressForm({
  goalId,
  goalSkillId,
  isCompleted,
}: SkillProgressFormProps) {
  const [state, formAction, isPending] = useActionState(
    advanceSkill,
    {},
  );

  return (
    <div className="flex flex-col items-center">
      <form action={formAction}>
        <input type="hidden" name="goalId" value={goalId} />
        <input
          type="hidden"
          name="goalSkillId"
          value={goalSkillId}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isPending || isCompleted}
          className="h-14 px-10 rounded-2xl font-medium"
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />

          {isPending
            ? "Advancing..."
            : isCompleted
              ? "Skill Mastered"
              : "Advance Skill"}
        </Button>
      </form>

      {state?.error && (
        <p className="mt-4 text-sm text-red-400 text-center">
          {state.error}
        </p>
      )}
    </div>
  );
}