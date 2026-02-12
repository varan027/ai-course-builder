"use client";
import { createCourse, FormState } from "@/actions/createCourse";
import { useActionState } from "react";
import SubmitButton from "./SubmitButton";
import Link from "next/link";
import { ChevronLeft, Sparkles, Layout, Clock, BarChart } from "lucide-react";

const page = () => {
  const [state, formAction] = useActionState(createCourse, {});

  return (
    <div className="min-h-screen bg-[#050505] py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>

        <div className="bg-card border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative Background Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                Generate Course
              </h1>
            </div>
            <p className="text-muted-foreground mb-8">
              Describe your topic and let AI forge a custom learning path for
              you.
            </p>

            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Layout className="w-4 h-4 text-primary" /> Topic or Skill
                </label>
                <input
                  id="topic"
                  name="topic"
                  placeholder="e.g. Advanced React Patterns or Italian Cooking"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <BarChart className="w-4 h-4 text-primary" /> Level
                  </label>
                  <select
                    name="level"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Layout className="w-4 h-4 text-primary" /> Chapters
                  </label>
                  <select
                    name="chapters"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                  >
                    <option value="5">5 Modules</option>
                    <option value="8">8 Modules</option>
                    <option value="12">12 Modules</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> Duration
                  </label>
                  <select
                    name="duration"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                  >
                    <option value="30">30 min</option>
                    <option value="60">60 min</option>
                    <option value="90">90 min</option>
                  </select>
                </div>
              </div>

              {state?.error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-xs text-destructive text-center">
                    {state.error}
                  </p>
                </div>
              )}

              <div className="pt-4">
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
