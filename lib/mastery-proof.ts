export type MasteryProofResult = {
  passed: boolean;
  reason: string;
};

export function evaluateMasteryProof(answer: string): MasteryProofResult {
  const normalized = answer.trim();

  if (normalized.length < 30) {
    return {
      passed: false,
      reason: "Give a more complete explanation showing how you would apply the skill.",
    };
  }

  return {
    passed: true,
    reason: "Your response is detailed enough to count as evidence of application.",
  };
}

export function getMasteryProofPrompt(skillTitle: string, practice: string): string {
  return [
    `You have just studied the skill "${skillTitle}".`,
    "",
    "Prove that you can apply it rather than simply recall its definition.",
    `Practice context: ${practice}`,
    "",
    "Write a short response explaining what you would do, why you would do it, and what result you would expect.",
    "Aim for at least 30 characters and focus on concrete application.",
  ].join("\n");
}
