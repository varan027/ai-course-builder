import { validateRoadmap } from "../domain/roadmap-validation";
import { AIOutputInvalidError } from "../errors/domain";
import { GeneratedRoadmapSchema, RoadmapSchema } from "./schema";

function parseWithSchema(rawText: string, schema: typeof RoadmapSchema | typeof GeneratedRoadmapSchema) {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new AIOutputInvalidError("AI returned invalid JSON");
  }

  const result = schema.safeParse(parsed);

  if (!result.success) {
    throw new AIOutputInvalidError("AI output does not match RoadmapSchema");
  }

  const validation = validateRoadmap(result.data.skills);

  if (!validation.valid) {
    throw new AIOutputInvalidError(`Invalid roadmap: ${validation.errors.join(", ")}`);
  }

  return result.data;
}

export function parseRoadmap(rawText: string) {
  return parseWithSchema(rawText, RoadmapSchema);
}

export function parseGeneratedRoadmap(rawText: string) {
  return parseWithSchema(rawText, GeneratedRoadmapSchema);
}
