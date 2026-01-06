import { getAuthUser } from "@/lib/auth";
import { assertCourseOwner } from "@/lib/permission";
import CourseModel from "@/models/CourseModel";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const user = await getAuthUser();

    const course = await assertCourseOwner(params.courseId, user.id);
    if (!course) {
      return NextResponse.json({ error: "course not found" }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const user = await getAuthUser();

    const course = await assertCourseOwner(params.courseId, user.id);
    console.log(user.id)

    await CourseModel.deleteOne({
      _id: params.courseId,
      userId: user.id,
    });

    return NextResponse.json(
      { message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 403 }
    );
  }
};
