import { courseService } from "@/services/course.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { progressService } from "@/services/progress.service";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const course = await courseService.getById(courseId, user);

  const progress = await progressService.getProgress(user.id, courseId)
  const completedSet = new Set(
    progress.filter(p => p.completed).map(p => p.chapter)
  )

  const total = course.outline.chapters.length;
  const completedCount = completedSet.size;
  const progressPercentage = Math.round((completedCount/total) * 100)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r px-4 py-6">
        <h2 className="font-semibold mb-4">{course.title}</h2>

        <p className="text-sm text-gray-400 mb-4">
          Completed: {progressPercentage}%
        </p>

        <ul className="space-y-2">
          {course.outline.chapters.map((chapter, index) => {

            const isDone = completedSet.has(index);

            return(
            <li key={index}>
              <Link
                href={`/courses/${course.id}/${index}`}
                className="block text-sm"
              >
                { isDone ? "✅ " : ""}
                {index + 1}. {chapter.title}
              </Link>
            </li>
            )
          })}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
