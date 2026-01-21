import { redirect } from "next/navigation";

export default async function CourseIndexPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params; // ✅ REQUIRED
  redirect(`/courses/${courseId}/0`);
}
