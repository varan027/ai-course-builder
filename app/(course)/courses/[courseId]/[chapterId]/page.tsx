import { courseService } from "@/services/course.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { toggleProgress } from "@/actions/toggleProgress";
import { progressService } from "@/services/progress.service";
import { Button } from "@/components/ui/button";
import { Check, RotateCcw, Clock } from "lucide-react";
import Link from "next/link";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { courseId, chapterId } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const course = await courseService.getById(courseId, user);
  const index = Number(chapterId);
  const chapter = course.outline.chapters[index];

  if (!chapter) redirect(`/courses/${courseId}/0`);

  const progress = await progressService.getProgress(user.id, courseId);
  const isCompleted = progress.some((p) => p.chapter === index && p.completed);

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
          Module {index + 1}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground text-sm">
          <Clock className="w-4 h-4" /> {chapter.durationMinutes} mins
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6">
        {chapter.title}
      </h1>
      <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 mb-10">
        <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
          What you'll learn
        </h3>
        <p className="text-base leading-relaxed text-white/90">
          {chapter.about}
        </p>
      </div>

      <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] bg-black mb-14">
        {chapter.youtubeVideoId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${chapter.youtubeVideoId}?rel=0`}
            title={chapter.title}
            allowFullScreen
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>Video loading or unavailable</p>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-10 border-t border-white/10">
        <form
          action={async () => {
            "use server";
            await toggleProgress(courseId, index);
            redirect(`/courses/${courseId}/${index}`);
          }}
        >
          {isCompleted && (
            <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-primary text-sm">
              ✓ You've completed this module.
            </div>
          )}
          <Button
            size="lg"
            variant={isCompleted ? "outline" : "default"}
            className={`h-14 px-10 rounded-2xl font-semibold transition-all duration-200 ${
              isCompleted
                ? "border-primary/20 text-primary hover:bg-primary/5"
                : "bg-primary text-black hover:scale-[1.02]"
            }`}
          >
            {isCompleted ? (
              <span className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5" /> Unmark as Complete
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Check className="w-5 h-5" /> Mark as Complete
              </span>
            )}
          </Button>
          <div className="flex justify-between mt-12">
            {index > 0 ? (
              <Link href={`/courses/${courseId}/${index - 1}`}>
                <Button variant="ghost">Previous</Button>
              </Link>
            ) : (
              <div />
            )}

            {index < course.outline.chapters.length - 1 && (
              <Link href={`/courses/${courseId}/${index + 1}`}>
                <Button variant="ghost">Next</Button>
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
