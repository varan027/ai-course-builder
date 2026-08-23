import { validateRoadmap } from "../domain/roadmap-validation";
import { AIOutputInvalidError } from "../errors/domain";
import { RoadmapSchema } from "./schema";

export function parseRoadmap(rawText: string) {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new AIOutputInvalidError("AI returned invalid JSON");
  }

  const result = RoadmapSchema.safeParse(parsed);

  if(!result.success) {
    throw new AIOutputInvalidError("AI output does not match RoadmapSchema");
  }

  const validation = validateRoadmap(result.data.skills);

  if (!validation.valid) {
    throw new AIOutputInvalidError(`Invalid roadmap: ${validation.errors.join(", ")}`);
  }

  return result.data;
}
