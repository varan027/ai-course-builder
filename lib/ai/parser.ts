import { AIOutputInvalidError } from "../errors/domain";
import { CourseOutlineSchema } from "./schema";

/**
 * AI Parser = Gatekeeper
 * - Accepts raw AI text
 * - Ensures valid JSON
 * - Ensures schema correctness
 * - Fails fast on any violation
 */
export function parseCourseOutline(rawText: string) {
  let parsed: unknown;

  // STEP 1: Is it valid JSON?
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new AIOutputInvalidError(
      "AI returned invalid JSON"
    );
  }

  // STEP 2: Does it match our contract?
  const result = CourseOutlineSchema.safeParse(parsed);

  if (!result.success) {
    throw new AIOutputInvalidError(
      "AI output does not match CourseOutlineSchema"
    );
  }

  // STEP 3: Return clean, trusted data
  return result.data;
}
