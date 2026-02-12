import { courseService } from "@/services/course.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { toggleProgress } from "@/actions/toggleProgress";
import { progressService } from "@/services/progress.service";
import { Button } from "@/components/ui/button";
import { Check, RotateCcw, Clock } from "lucide-react";

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

  // Check if this specific chapter is completed
  const progress = await progressService.getProgress(user.id, courseId);
  const isCompleted = progress.some((p) => p.chapter === index && p.completed);

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter">
          Module {index + 1}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground text-sm">
          <Clock className="w-4 h-4" /> {chapter.durationMinutes} mins
        </span>
      </div>

      <h1 className="text-4xl font-bold mb-4 text-white tracking-tight">{chapter.title}</h1>
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{chapter.about}</p>

      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-black mb-10">
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

      <div className="flex justify-end pt-6 border-t border-white/5">
        <form action={async () => {
          "use server";
          await toggleProgress(courseId, index);
        }}>
          <Button 
            size="lg"
            variant={isCompleted ? "outline" : "default"}
            className={`h-14 px-8 rounded-xl font-bold transition-all ${
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
        </form>
      </div>
    </div>
  );
}