export type ProjectProofState = "LOCKED" | "READY" | "IN_PROGRESS";

export function getProjectProofState(
  skillStatus: string,
  started: boolean,
): ProjectProofState {
  if (skillStatus !== "MASTERED") return "LOCKED";
  return started ? "IN_PROGRESS" : "READY";
}
