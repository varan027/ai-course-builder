import { validateRoadmap } from "../domain/roadmap-validation";
import { AIOutputInvalidError } from "../errors/domain";
import {
  MasteryEvaluationSchema,
  RoadmapSchema,
} from "./schema";

function parseJson(rawText: string): unknown {
  try {
    return JSON.parse(
      rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim(),
    );
  } catch {
    throw new AIOutputInvalidError("AI returned invalid JSON");
  }
}

export function parseRoadmap(rawText: string) {
  const result = RoadmapSchema.safeParse(parseJson(rawText));

  if (!result.success) {
    throw new AIOutputInvalidError("AI output does not match RoadmapSchema");
  }

  const validation = validateRoadmap(result.data.skills);
  if (!validation.valid) {
    throw new AIOutputInvalidError(
      `Invalid roadmap: ${validation.errors.join(", ")}`,
    );
  }

  return result.data;
}

export function parseMasteryEvaluation(rawText: string) {
  const result = MasteryEvaluationSchema.safeParse(parseJson(rawText));

  if (!result.success) {
    throw new AIOutputInvalidError(
      "AI output does not match MasteryEvaluationSchema",
    );
  }

  return result.data;
}
