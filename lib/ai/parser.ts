import { AIOutputInvalidError } from "../errors/domain";
import { CourseOutlineSchema } from "./schema";

export function parseCourseOutline(rawText: string) {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new AIOutputInvalidError("AI returned invalid JSON");
  }

  const result = CourseOutlineSchema.safeParse(parsed);

  if (!result.success) {
    console.error(
      "AI SCHEMA ERROR:",
      JSON.stringify(result.error.format(), null, 2),
    );

    throw new AIOutputInvalidError(
      "AI output does not match CourseOutlineSchema",
    );
  }

  return result.data;
}
