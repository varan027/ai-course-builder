import { getAuthUser } from "@/lib/auth";
import { assertCourseOwner } from "@/lib/permission";
import CourseModel from "@/models/CourseModel";
import { NextRequest, NextResponse } from "next/server";
import ConnectToDB from "@/lib/db"; // Ensure DB connection is imported

// FIX: Type definition for Next.js 15 params
type Props = {
  params: Promise<{
    courseId: string;
  }>;
};

export const GET = async (req: NextRequest, { params }: Props) => {
  try {
    const { courseId } = await params; // 1. Await params
    const user = await getAuthUser();

    // 2. Ensure DB is connected (Safety check)
    await ConnectToDB();

    const course = await assertCourseOwner(courseId, user.id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: Props) => {
  try {
    const { courseId } = await params; // 1. Await params here too
    const user = await getAuthUser();

    await ConnectToDB();

    // Verify ownership before deleting
    await assertCourseOwner(courseId, user.id);

    const result = await CourseModel.deleteOne({
      _id: courseId,
      userId: user.id,
    });

    if (result.deletedCount === 0) {
        return NextResponse.json({ error: "Course not found or already deleted" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
};