export const ROADMAP_PROMPT = ( goal : string ) => `
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
      "prerequisites": [],
      "youtubeQuery": ""
    }
  ]
}
`;