import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import CourseDetailClient from "./CourseDetailClient";
import { assertCourseOwner } from "@/lib/permission";

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseDetailPage({ params }: PageProps) {

  const { courseId } = await params;

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  try {
    const course = await assertCourseOwner(courseId, session.user.id);

    return <CourseDetailClient course={course} />;
  } catch(error: any) {
    console.log(error)
  }
}
