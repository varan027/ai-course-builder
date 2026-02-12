import { courseService } from "@/services/course.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { toggleProgress } from "@/actions/toggleProgress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, Youtube, Check } from "lucide-react";

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-medium text-sm tracking-wide uppercase">
          <span className="bg-primary/10 px-2 py-0.5 rounded">
            Chapter {index + 1}
          </span>
          <Separator orientation="vertical" className="h-4 bg-white/10" />
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4" /> {chapter.durationMinutes} mins
          </span>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          {chapter.title}
        </h1>
      </header>

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
        {chapter.youtubeVideoId ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${chapter.youtubeVideoId}?rel=0&showinfo=0`}
            title={chapter.title}
            allowFullScreen
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4 bg-zinc-900">
            <Youtube className="w-12 h-12 text-red-500" />
            <p className="text-muted-foreground text-center px-4">
              Video content currently unavailable for this module.
            </p>
            <Button variant="outline" asChild>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(chapter.youtubeQuery)}`}
                target="_blank"
              >
                Search Manually
              </a>
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold text-white">
            Learning Objectives
          </h3>
          <p className="text-gray-400 leading-relaxed text-lg">
            {chapter.about}
          </p>
        </div>

        <div className="lg:col-span-1 bg-white/5 rounded-2xl p-6 border border-white/10 sticky top-8">
          <form
            action={async () => {
              "use server";
              await toggleProgress(courseId, index);
            }}
          >
            <Button className="w-full py-6 text-md font-bold group relative overflow-hidden transition-all">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Mark as Complete
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-primary to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </form>
          <p className="text-[11px] text-center text-muted-foreground mt-4 uppercase tracking-widest">
            Update your progress to stay on track
          </p>
        </div>
      </div>
    </div>
  );
}
