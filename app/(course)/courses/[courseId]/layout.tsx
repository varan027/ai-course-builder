import { courseService } from "@/services/course.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

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

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r px-4 py-6">
        <h2 className="font-semibold mb-4">{course.title}</h2>

        <ul className="space-y-2">
          {course.outline.chapters.map((chapter, index) => (
            <li key={index}>
              <Link
                href={`/courses/${course.id}/${index}`}
                className="block text-sm text-gray-600 hover:text-white"
              >
                {index + 1}. {chapter.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
