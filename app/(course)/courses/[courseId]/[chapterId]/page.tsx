import { courseService } from "@/services/course.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

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

      <a
        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
          chapter.youtubeQuery,
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 text-sm underline"
      >
        Search this topic on YouTube
      </a>
    </div>
  );
}
