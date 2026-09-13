"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { startProject, type FormState } from "@/actions/startProject";
import { Button } from "@/components/ui/button";

const initialState: FormState = {};

export default function StartProjectForm({
  goalId,
  goalSkillId,
}: {
  goalId: string;
  goalSkillId: string;
}) {
  const [state, action, pending] = useActionState(startProject, initialState);

  return (
    <form action={action} className="space-y-4">
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <input type="hidden" name="goalId" value={goalId} />
      <input type="hidden" name="goalSkillId" value={goalSkillId} />
      <Button type="submit" disabled={pending} className="rounded-full px-5 shadow-none">
        {pending ? "Starting project…" : "Start project"}
        {!pending && <ArrowRight className="size-4" />}
      </Button>
    </form>
  );
}
