"use server";

import { goalService } from "@/services/goal.service";
import { redirect } from "next/navigation";
import { goalSchema } from "./createGoal.schema";
import { getCurrentUser } from "@/lib/auth";
import { AIOutputInvalidError } from "@/lib/errors/domain";

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
    await goalService.create(parsedGoal.data, user.id);

    redirect("/dashboard");
  } catch (err) {
    if (err instanceof Error && err.message === "NEXT_REDIRECT") {
      throw err;
    }

    console.error("[createGoal] failed:", err);

    if (err instanceof AIOutputInvalidError) {
      return {
        error: "We couldn't generate a valid roadmap. Please try again.",
      };
    }

    return {
      error: "We couldn't create your goal. Please try again.",
    };
  }
}
