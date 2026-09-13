export type ProjectProofState =
  | "available"
  | "in_progress"
  | "completed";

export function getProjectProofState(
  projectChallenge: string,
  mastered: boolean,
): ProjectProofState {
  if (!projectChallenge.trim()) return "completed";
  if (mastered) return "available";
  return "in_progress";
}
