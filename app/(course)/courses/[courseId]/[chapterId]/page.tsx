import { goalService } from "@/services/goal.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { toggleProgress } from "@/actions/toggleProgress";
import { progressService } from "@/services/progress.service";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Target,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

export default async function SkillPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { courseId, chapterId } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const goal = await goalService.getById(courseId, user);

  const index = Number(chapterId);

  const skill = goal.roadmap.skills[index];

  if (!skill) {
    redirect(`/courses/${courseId}/0`);
  }

  const progress = await progressService.getProgress(user.id, courseId);

  const isCompleted = progress.some(
    (p) => p.skillId === skill.id && p.status === "MASTERED",
  );

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-[0.2em]">
            Skill {index + 1}
          </span>

          {isCompleted && (
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs uppercase tracking-[0.2em]">
              Mastered
            </span>
          )}
        </div>

        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6">
          {skill.title}
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
          {skill.whyImportant}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <div className="rounded-3xl border border-white/10 bg-[#0f0f0f] p-8">
          <Lightbulb className="w-5 h-5 mb-4 text-primary" />

          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Understanding
          </p>

          <p className="leading-relaxed text-white/90">{skill.description}</p>
        </div>

        <div className="rounded-3xl border border-primary/10 bg-primary/5 p-8">
          <Target className="w-5 h-5 mb-4 text-primary" />

          <p className="text-xs uppercase tracking-widest text-primary mb-4">
            Milestone
          </p>

          <p className="text-lg font-medium leading-relaxed">
            {skill.milestone}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#111111] p-8 mb-10">
        <div className="flex items-center gap-3 mb-5">
          <Trophy className="w-5 h-5 text-primary" />

          <p className="text-xs uppercase tracking-widest text-primary">
            Project Challenge
          </p>
        </div>

        <p className="text-lg leading-relaxed text-white/90">
          {skill.projectChallenge}
        </p>
      </div>

      {skill.dependsOn.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-[#0f0f0f] p-8 mb-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Prerequisites
          </p>

          <div className="flex flex-wrap gap-3">
            {skill.dependsOn.map((dependency) => (
              <span
                key={dependency}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm"
              >
                {dependency}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Learning Resource
        </p>
      </div>

      <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 bg-black mb-14">
        {skill.youtubeVideoId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${skill.youtubeVideoId}?rel=0`}
            title={skill.title}
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Resource unavailable
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-10">
        <div className="flex flex-col items-center gap-6">
          {isCompleted && (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 px-5 py-3 text-green-400">
              ✓ Skill Mastered
            </div>
          )}

          <form
            action={async () => {
              "use server";

              await toggleProgress(courseId, skill.id);

              redirect(`/courses/${courseId}/${index}`);
            }}
          >
            <Button size="lg" className="h-14 px-10 rounded-2xl font-medium">
              <CheckCircle2 className="w-5 h-5 mr-2" />

              {isCompleted ? "Reset Mastery" : "Mark as Mastered"}
            </Button>
          </form>

          <div className="flex justify-between w-full">
            {index > 0 ? (
              <Link href={`/courses/${courseId}/${index - 1}`}>
                <Button variant="ghost">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {index < goal.roadmap.skills.length - 1 && (
              <Link href={`/courses/${courseId}/${index + 1}`}>
                <Button variant="ghost">
                  Continue Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
