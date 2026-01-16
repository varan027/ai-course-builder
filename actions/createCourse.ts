"use server";
import { courseService } from "@/services/course.service";
import { redirect } from "next/navigation";
import { createCourseSchema } from "./createCourse.schema";
import { getCurrentUser } from "@/lib/auth";

export type FormState = {
  error?: string;
};

export async function createCourse(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawData = {
    topic: formData.get("topic"),
    level: formData.get("level"),
    chapters: formData.get("chapters"),
    duration: formData.get("duration"),
  };

  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const parsed = createCourseSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      error: parsed.error.message,
    };
  }
  const data = parsed.data;

  await courseService.create(data, user);

  redirect("/dashboard");
}
