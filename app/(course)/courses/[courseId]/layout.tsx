import { courseService } from "@/services/course.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import CourseProvider from "./CourseProvider";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params; // ✅ FIX

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const course = await courseService.getById(courseId, user);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r px-4 py-6">
        <h2 className="font-semibold mb-4 text-sm text-gray-600">
          Chapters
        </h2>

        <ul className="space-y-2">
          {course.outline.chapters.map((chapter, index) => (
            <li key={chapter.title}>
              <Link
                href={`/courses/${course.id}/${index}`}
                className="block rounded px-2 py-1 text-sm hover:bg-gray-100"
              >
                {index + 1}. {chapter.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-6 py-8">
        <CourseProvider course={course}>
          {children}
        </CourseProvider>
      </main>
    </div>
  );
}
