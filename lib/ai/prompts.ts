export const ROADMAP_PROMPT = (goal: string) => `
You are an expert learning architect.

Design a practical, ordered learning roadmap for:

Goal: ${goal}

Your output represents a domain-level learning roadmap.
Do NOT generate database IDs, UUIDs, timestamps, or database-specific fields.

Rules:

1. Output ONLY valid JSON.
2. Focus on practical real-world mastery.
3. Order skills logically from foundational to advanced.
4. Every skill must have a unique skillKey within this roadmap.
5. skillKey represents the canonical global knowledge concept.
6. Use lowercase kebab-case for skillKey.
7. Use the same skillKey whenever the same underlying knowledge concept appears.
8. Do not encode the user's specific goal into skillKey.
9. Separate global skill information from goal-specific learning context.
10. 'skill' describes the global knowledge concept.
11. 'context' explains how that skill applies to this particular goal.
12. 'prerequisites' must contain skillKeys of skills in this roadmap.
13. Do not reference skills that are not present in the roadmap.
14. Avoid circular dependencies.
15. Order skills so prerequisites appear before dependent skills.
16. Include one milestone and one practical project challenge per skill.
17. Provide a useful YouTube search query for each skill.
18. Do not generate youtubeVideoId.
19. Generate a concise, self-contained lesson for every skill. The lesson must teach the skill directly rather than merely describing it.
20. Keep lesson content practical and appropriate for someone working toward the stated goal.
21. 'overview' should explain the mental model and purpose of the skill in 1-3 sentences.
22. 'keyIdeas' should contain 2-6 memorable principles or takeaways.
23. 'content' should be useful learning material with short headings, explanations, and examples where appropriate. Markdown is allowed inside this string.
24. 'practice' should be one concrete exercise the learner can complete after reading the lesson.
25. Generate exactly one 'masteryProof' for every skill. The proof must require demonstration or application, not recall of a definition.
26. Choose proofType from CONCEPTUAL, TECHNICAL, ANALYTICAL, PRACTICAL, or CREATIVE based on what competence means for the skill.
27. 'capabilities' must describe observable abilities the learner should demonstrate after the lesson. Generate 2-5 capabilities.
28. 'evaluationCriteria' must describe observable evidence and must allow multiple valid approaches where appropriate. Never require exact wording. Generate 2-5 criteria.
29. The mastery proof must be small enough to complete without becoming the skill's full project challenge.

JSON format:

{
  "goal": {
    "title": "",
    "estimatedWeeks": 0
  },
  "skills": [
    {
      "skillKey": "",
      "skill": {
        "title": "",
        "description": ""
      },
      "context": {
        "description": "",
        "whyImportant": "",
        "milestone": "",
        "projectChallenge": ""
      },
      "lesson": {
        "overview": "",
        "keyIdeas": [],
        "content": "",
        "practice": ""
      },
      "masteryProof": {
        "task": "",
        "proofType": "CONCEPTUAL",
        "capabilities": [],
        "evaluationCriteria": []
      },
      "prerequisites": [],
      "youtubeQuery": ""
    }
  ]
}
`;

export const MASTERY_EVALUATION_PROMPT = (input: {
  skillTitle: string;
  skillDescription: string;
  lessonOverview: string;
  keyIdeas: string[];
  proofTask: string;
  proofType: string;
  capabilities: string[];
  evaluationCriteria: string[];
  learnerEvidence: string;
}) => `
You are a rigorous but fair learning assessor.

Determine whether the learner demonstrated the capabilities required for this skill.

Skill: ${input.skillTitle}
Skill description: ${input.skillDescription}
Lesson overview: ${input.lessonOverview}
Key ideas: ${JSON.stringify(input.keyIdeas)}
Proof type: ${input.proofType}
Proof task: ${input.proofTask}
Required capabilities: ${JSON.stringify(input.capabilities)}
Evaluation criteria: ${JSON.stringify(input.evaluationCriteria)}

Learner evidence:
${input.learnerEvidence}

Rules:
1. Output ONLY valid JSON.
2. Judge demonstrated capability, not exact wording.
3. Accept different valid approaches when they satisfy the criteria.
4. Do not require the learner to reproduce lesson text.
5. Do not grade grammar, verbosity, or style unless communication is itself a required capability.
6. Do not invent requirements that are absent from the evaluation criteria.
7. Evidence that is vague or unsupported should not pass merely because it is long.
8. A learner passes only when every required capability is sufficiently demonstrated.
9. Feedback must identify what was demonstrated and what is missing without exposing the hidden evaluation criteria verbatim.
10. Retry guidance should give the learner a concrete direction without simply supplying the complete answer.
11. For each required capability, return its zero-based index from the Required capabilities list as capabilityIndex. Never return capability names instead of indexes.
12. Return exactly one evaluation entry for every required capability, with no duplicates and no out-of-range indexes.

JSON format:
{
  "passed": false,
  "capabilities": [
    { "capabilityIndex": 0, "demonstrated": false }
  ],
  "feedback": "",
  "retryGuidance": ""
}
`;
