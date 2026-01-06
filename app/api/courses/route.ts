import { getAuthUser } from "@/lib/auth";
import { getUserCourses } from "@/lib/data";
import { NextResponse } from "next/server";

export const GET = async () => {
  try{
    const user = await getAuthUser();

    const courses = await getUserCourses(user.id);
    
    return NextResponse.json({ courses }, { status: 200});
  } catch (error : any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "unauthorized" ? 401 : 500}
    )
  }
}