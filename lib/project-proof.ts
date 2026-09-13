export type ProjectProofState = "LOCKED" | "READY" | "IN_PROGRESS";

export function getProjectProofState(
  projectChallenge: string,
  mastered: boolean,
): ProjectProofState {
  if (!projectChallenge.trim() || !mastered) return "LOCKED";
  return "IN_PROGRESS";
}
