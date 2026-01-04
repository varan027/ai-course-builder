import { getAuthUser } from "@/lib/auth";
import ConnectToDB from "@/lib/db";
import CourseModel from "@/models/CourseModel";
import { NextRequest, NextResponse } from "next/server";

export async function Get(req: NextRequest, { params }: { params : { courseId: string } }) {
  try{
    const user = await getAuthUser();
    await ConnectToDB();

    const course = await CourseModel.findOne({
      _id: params.courseId,
      userId: user.id
    })

    if(!course){
      return NextResponse.json(
        { error: "course not found"},
        { status: 404 }
      )
    }

    return NextResponse.json({course})
  } catch (error: any){
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}