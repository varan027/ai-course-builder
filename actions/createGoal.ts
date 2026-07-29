"use server";

import { goalService } from "@/services/goal.service";
import { redirect } from "next/navigation";
import { goalSchema } from "./createGoal.schema";
import { getCurrentUser } from "@/lib/auth";

export type FormState = {
  error?: string;
};

export async function createGoal(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const goal = formData.get("goal");

  const user = await getCurrentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const parsedGoal = goalSchema.safeParse(goal);

  if (!parsedGoal.success) {
    return {
      error: parsedGoal.error.issues[0]?.message ?? "Invalid goal",
    };
  }

  try {
    await goalService.create(parsedGoal.data, user);

    redirect("/dashboard");
  } catch (err) {
    if (err instanceof Error && err.message === "NEXT_REDIRECT") {
      throw err;
    }

    console.error("CREATE GOAL FAILED:", err);

    return {
      error: "Failed to generate roadmap. Please try again.",
    };
  }
}
