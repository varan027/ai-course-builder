export type ProjectProofState =
  | "LOCKED"
  | "READY"
  | "IN_PROGRESS"
  | "EVIDENCE_SUBMITTED"
  | "COMPLETED";

export function getProjectProofState(
  skillStatus: string,
  started: boolean,
  evidenceSubmitted = false,
  completed = false,
): ProjectProofState {
  if (skillStatus !== "MASTERED") return "LOCKED";
  if (!started) return "READY";
  if (!evidenceSubmitted) return "IN_PROGRESS";
  if (!completed) return "EVIDENCE_SUBMITTED";
  return "COMPLETED";
}
