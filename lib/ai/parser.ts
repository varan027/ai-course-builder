import { error } from "node:console";
import { CourseOutlineSchema } from "./schema";

export function parseCourseOutline(rawText: string)  {
  let parsed : unknown;

  try{
    parsed = JSON.parse(rawText)
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  const result = CourseOutlineSchema.safeParse(parsed);

  if(!result.success){
    console.error("AI Schema Violation:", result.error.format());
    throw new Error("AI output failed validation")
  }

  return result.data;
}