"use client";

import { createGoal } from "@/actions/createGoal";
import { useActionState } from "react";
import SubmitButton from "./SubmitButton";
import Link from "next/link";
import {
  ChevronLeft,
  Sparkles,
} from "lucide-react";

export default function CreateGoalPage() {
  const [state, formAction] = useActionState(createGoal, {});

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors mb-12"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Dashboard
        </Link>

        <div className="space-y-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">
              <Sparkles className="w-3 h-3" />
              Syllarc
            </div>

            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-none mb-6">
              What do you
              <br />
              want to become?
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Describe your destination.
              Syllarc will generate a roadmap, learning path,
              project challenges, and skill progression system.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-8 md:p-10">
            <form action={formAction} className="space-y-8">
              <div>
                <label className="block text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
                  Goal
                </label>

                <input
                  id="goal"
                  name="goal"
                  required
                  autoFocus
                  placeholder="Frontend Developer"
                  className="w-full bg-transparent text-3xl md:text-4xl font-medium border-none outline-none placeholder:text-white/20"
                />

                <div className="h-px bg-white/10 mt-4" />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-white/10 p-4">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    Example
                  </div>

                  <div className="font-medium">
                    Frontend Developer
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 p-4">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    Example
                  </div>

                  <div className="font-medium">
                    AI Engineer
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 p-4">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    Example
                  </div>

                  <div className="font-medium">
                    Filmmaker
                  </div>
                </div>
              </div>

              {state?.error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                  <p className="text-sm text-red-400">
                    {state.error}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Generates roadmap, skills, projects and progression.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <SubmitButton />
                </div>
              </div>
            </form>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 p-6 bg-[#0a0a0a]">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Roadmap
              </div>

              <p className="text-sm text-white/80">
                Structured learning sequence based on your goal.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 p-6 bg-[#0a0a0a]">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Projects
              </div>

              <p className="text-sm text-white/80">
                Real-world challenges to apply each skill.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 p-6 bg-[#0a0a0a]">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Progress
              </div>

              <p className="text-sm text-white/80">
                Track mastery and move through your skill journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}