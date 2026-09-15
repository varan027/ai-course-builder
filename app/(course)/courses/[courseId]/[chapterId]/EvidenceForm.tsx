"use client";

import { useActionState } from "react";
import { submitEvidence, type EvidenceFormState } from "@/actions/submitEvidence";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";

const initialState: EvidenceFormState = {};

type EvidenceFormProps = {
  goalId: string;
  goalSkillId: string;
  criteria: string[];
  practice: string;
};

export default function EvidenceForm({
  goalId,
  goalSkillId,
  criteria,
  practice,
}: EvidenceFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitEvidence,
    initialState,
  );

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5 sm:p-6">
        <p className="text-sm font-semibold">Mastery criteria</p>
        <ul className="mt-4 space-y-3">
          {criteria.map((criterion) => (
            <li key={criterion} className="flex gap-3 text-sm leading-6 text-foreground/85">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{criterion}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 border-l border-primary/40 pl-4 text-sm leading-6 text-muted-foreground">
          Practice: {practice}
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="goalId" value={goalId} />
        <input type="hidden" name="goalSkillId" value={goalSkillId} />
        <textarea
          name="response"
          required
          minLength={30}
          rows={7}
          placeholder="Explain what you would do, why you would do it, and what result you would expect."
          className="w-full resize-y rounded-2xl border border-white/[0.08] bg-white/[0.018] px-4 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
        />
        <Button type="submit" size="lg" disabled={isPending} className="h-12 rounded-full px-6 font-medium shadow-none">
          {isPending ? "Evaluating..." : "Submit evidence"}
          {!isPending && <ArrowRight className="size-4" />}
        </Button>
      </form>

      {state.error && <p className="mt-3 text-sm text-red-400">{state.error}</p>}

      {state.feedback && (
        <div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5">
          <div className="flex items-center gap-2">
            {state.passed ? <CheckCircle2 className="size-4 text-primary" /> : <RotateCcw className="size-4 text-muted-foreground" />}
            <p className="text-sm font-semibold">{state.passed ? "Mastery demonstrated" : "Keep practicing"}</p>
            <span className="ml-auto text-xs text-muted-foreground">Score: {state.score ?? 0}/100</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{state.feedback}</p>
        </div>
      )}
    </div>
  );
}
