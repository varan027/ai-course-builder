import { courseService } from "@/services/course.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { toggleProgress } from "@/actions/toggleProgress";

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

  if (!chapter) {
    redirect(`/courses/${courseId}/0`);
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-2">{chapter.title}</h1>

      <p className="text-sm text-gray-500 mb-4">
        ⏱ {chapter.durationMinutes} minutes
      </p>

      <p className="mb-6">{chapter.about}</p>

      {chapter.youtubeVideoId ? (
        <iframe
          className="w-full h-64 rounded-md"
          src={`https://www.youtube.com/embed/${chapter.youtubeVideoId}`}
          title={chapter.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <a
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
            chapter.youtubeQuery,
          )}`}
          target="_blank"
          className="text-blue-600 underline"
        >
          Search on YouTube
        </a>
      )}

      <form action={
        async () => {
          "use server";
          await toggleProgress(courseId, index)
        }
      }>
        <button className="mt-4 border px-3 py-1 rounded-md">
          Mark as Complete
        </button>
      </form>
    </div>
  );
}
