import { goalService } from "@/services/goal.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { toggleProgress } from "@/actions/toggleProgress";
import { progressService } from "@/services/progress.service";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Circle, Lightbulb, Play, Target, Trophy } from "lucide-react";
import Link from "next/link";

export default async function SkillPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { courseId, chapterId } = await params;
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const goal = await goalService.getById(courseId, user);
  const index = Number(chapterId);
  const skills = goal.roadmap.skills ?? [];
  const skill = skills[index];

  if (!skill) redirect(`/courses/${courseId}/0`);

  const progress = await progressService.getProgress(user.id, courseId);
  const isCompleted = progress.some((p) => p.skillId === skill.id && p.status === "MASTERED");
  const completedIds = new Set(progress.filter((p) => p.status === "MASTERED").map((p) => p.skillId));
  const previousComplete = index === 0 || completedIds.has(skills[index - 1]?.id);
  const nextSkill = skills[index + 1];

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <Link href={`/courses/${courseId}`} className="inline-flex items-center text-sm text-muted-foreground transition hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to journey
        </Link>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">Skill {index + 1} of {skills.length}</span>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">{isCompleted ? "Mastered" : "In progress"}</span>
        </div>
      </div>

      <header className="mb-10">
        <div className="mb-5 text-[10px] uppercase tracking-[0.25em] text-primary">{goal.title}</div>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">{skill.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">{skill.whyImportant}</p>
      </header>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Understand", icon: BookOpen, active: true },
          { label: "Practice", icon: Target, active: true },
          { label: "Master", icon: Trophy, active: isCompleted },
        ].map(({ label, icon: Icon, active }) => (
          <div key={label} className={`rounded-2xl border p-4 ${active ? "border-primary/20 bg-primary/[0.05]" : "border-white/10 bg-white/[0.02]"}`}>
            <div className="flex items-center gap-3">
              <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium">{label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[28px] border border-white/10 bg-[#0e0e0e] p-7 md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <Lightbulb className="h-5 w-5 text-primary" />
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Understand the idea</div>
          </div>
          <p className="leading-8 text-white/90">{skill.description}</p>
        </section>

        <section className="rounded-[28px] border border-primary/15 bg-primary/[0.055] p-7 md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <Target className="h-5 w-5 text-primary" />
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary">Your checkpoint</div>
          </div>
          <p className="text-lg font-medium leading-8">{skill.milestone}</p>
          {skill.dependsOn?.length ? (
            <div className="mt-7 border-t border-white/10 pt-5">
              <div className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Prerequisites</div>
              <div className="flex flex-wrap gap-2">
                {skill.dependsOn.map((dependency: string) => (
                  <span key={dependency} className="rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-xs text-white/70">{dependency}</span>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </div>

      <section className="mt-6 rounded-[28px] border border-white/10 bg-[#0b0b0b] p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <Play className="h-4 w-4" />
              Learn from a resource
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Use the resource, then apply the idea in the challenge below.</p>
          </div>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
          {skill.youtubeVideoId ? (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${skill.youtubeVideoId}?rel=0&modestbranding=1`}
              title={skill.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Resource unavailable</div>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-[28px] border border-white/10 bg-[#111111] p-7 md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <Target className="h-5 w-5 text-primary" />
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary">Practice by building</div>
        </div>
        <p className="max-w-4xl text-lg leading-8 text-white/90">{skill.projectChallenge}</p>
      </section>

      <section className="mt-8 rounded-[28px] border border-white/10 bg-[#0c0c0c] p-7 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              {isCompleted ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
              {isCompleted ? "You’ve marked this skill as mastered." : "Ready to check this skill off?"}
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Only mark mastery after you can explain the idea and complete the challenge without simply copying the resource.
            </p>
          </div>
          <form action={async () => {
            "use server";
            await toggleProgress(courseId, skill.id);
            redirect(`/courses/${courseId}/${index}`);
          }}>
            <Button size="lg" className="h-12 rounded-2xl px-6">
              {isCompleted ? "Reset mastery" : "Mark as mastered"}
            </Button>
          </form>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
          {index > 0 ? (
            <Link href={`/courses/${courseId}/${index - 1}`}>
              <Button variant="ghost" className="rounded-xl">
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            </Link>
          ) : <div />}

          {nextSkill ? (
            <Link href={isCompleted || previousComplete ? `/courses/${courseId}/${index + 1}` : "#"} aria-disabled={!isCompleted && !previousComplete}>
              <Button className="rounded-xl" variant={isCompleted || previousComplete ? "default" : "outline"}>
                {isCompleted ? "Continue to next skill" : "Finish this skill first"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href={`/courses/${courseId}`}>
              <Button className="rounded-xl">Back to journey</Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}