export const ROADMAP_PROMPT_VERSION = "roadmap-v2";

export const ROADMAP_PROMPT = (goal: string) => `
You are an expert learning architect.
Prompt version: ${ROADMAP_PROMPT_VERSION}

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
19. Generate a concise, self-contained lesson for every skill.
20. Keep lesson content practical and appropriate for someone working toward the stated goal.
21. 'overview' should explain the mental model and purpose of the skill in 1-3 sentences.
22. 'keyIdeas' should contain 2-6 memorable principles or takeaways.
23. 'content' should be useful learning material with short headings, explanations, and examples where appropriate. Markdown is allowed inside this string.
24. 'practice' should be one concrete exercise the learner can complete after reading the lesson.
25. 'masteryCriteria' must contain 2-6 observable statements describing what a learner must be able to explain or apply to demonstrate mastery.
26. Mastery criteria must be specific to the skill, testable from a learner response, and must not be vague statements such as "understands the topic".

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
        "practice": "",
        "masteryCriteria": []
      },
      "prerequisites": [],
      "youtubeQuery": ""
    }
  ]
}
`;

export const MASTERY_EVALUATION_PROMPT_VERSION = "mastery-evaluation-v1";

export const MASTERY_EVALUATION_PROMPT = (input: {
  skillTitle: string;
  skillDescription: string;
  criteria: string[];
  practice: string;
  response: string;
}) => `
You are a strict but constructive learning evaluator.
Prompt version: ${MASTERY_EVALUATION_PROMPT_VERSION}

Evaluate the learner response against ONLY the supplied mastery criteria.
Do not invent additional requirements.

Skill: ${input.skillTitle}
Skill description: ${input.skillDescription}

Mastery criteria:
${input.criteria.map((criterion, index) => `${index + 1}. ${criterion}`).join("\n")}

Practice context:
${input.practice}

Learner response:
${input.response}

Rules:
1. Output ONLY valid JSON.
2. Score from 0 to 100.
3. 'passed' must be true only when the response demonstrates the required criteria sufficiently.
4. Evaluate each supplied criterion exactly once.
5. Feedback must be actionable and explain what to improve when the learner fails.
6. Do not reward length alone; reward correct reasoning and practical application.

JSON format:
{
  "passed": false,
  "score": 0,
  "strengths": [],
  "gaps": [],
  "feedback": "",
  "criteriaResults": [
    {
      "criterion": "",
      "passed": false,
      "feedback": ""
    }
  ]
}
`;
