export type MasteryProofResult = boolean;

export function evaluateMasteryProof(
  _question: string,
  requiredEvidence: string[],
  answer: string,
): MasteryProofResult {
  const normalizedAnswer = answer.toLowerCase();

  if (normalizedAnswer.trim().length < 30) return false;

  const matchedEvidence = requiredEvidence.filter((evidence) => {
    const keywords = evidence
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length >= 4);

    return keywords.length === 0 || keywords.some((keyword) => normalizedAnswer.includes(keyword));
  });

  return matchedEvidence.length >= Math.min(2, requiredEvidence.length);
}

export function canAdvanceToMastery(proofPassed: boolean): boolean {
  return proofPassed;
}

export function getMasteryProofPrompt(
  skillTitle: string,
  practice: string,
  question?: string,
): string {
  return [
    `You have just studied the skill "${skillTitle}".`,
    "",
    "Prove that you can apply it rather than simply recall its definition.",
    `Practice context: ${practice}`,
    question ? `Checkpoint question: ${question}` : "",
    "",
    "Write a short response explaining what you would do, why you would do it, and what result you would expect.",
    "Focus on concrete application and evidence from the skill.",
  ]
    .filter(Boolean)
    .join("\n");
}
