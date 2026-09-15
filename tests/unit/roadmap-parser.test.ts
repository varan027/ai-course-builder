import { describe, expect, it } from "vitest";
import { parseRoadmap } from "@/lib/ai/parser";
import { AIOutputInvalidError } from "@/lib/errors/domain";

function lesson() {
  return {
    overview: "A practical mental model for the skill and why it matters.",
    keyIdeas: ["Use semantic structure", "Prefer predictable patterns"],
    content: "Learn the core concepts, how they fit together, and how to apply them in a small real project.",
    practice: "Build a small example and explain each important decision.",
    masteryCriteria: [
      "Explain the core concept in your own words and identify when to use it.",
      "Apply the concept correctly in a concrete practical scenario.",
    ],
  };
}

describe("parseRoadmap", () => {
  it("accepts a valid roadmap", () => {
    const rawText = JSON.stringify({
      goal: { title: "Frontend Developer", estimatedWeeks: 20 },
      skills: [
        {
          skillKey: "html-fundamentals",
          skill: {
            title: "HTML Fundamentals",
            description: "Learn semantic HTML and document structure.",
          },
          context: {
            description: "Learn HTML structure and semantics.",
            whyImportant: "HTML is the foundation of web pages.",
            milestone: "Can build a semantic HTML page.",
            projectChallenge: "Build a semantic portfolio page.",
          },
          lesson: lesson(),
          prerequisites: [],
          youtubeQuery: "HTML fundamentals tutorial",
        },
      ],
    });

    const result = parseRoadmap(rawText);

    expect(result.goal.title).toBe("Frontend Developer");
    expect(result.skills).toHaveLength(1);
    expect(result.skills[0].skillKey).toBe("html-fundamentals");
    expect(result.skills[0].lesson.masteryCriteria).toHaveLength(2);
  });

  it("rejects invalid JSON", () => {
    expect(() => parseRoadmap("this is not JSON")).toThrow(AIOutputInvalidError);
  });

  it("rejects a roadmap that violates the schema", () => {
    const rawText = JSON.stringify({
      goal: { title: "Frontend Developer", estimatedWeeks: 20 },
      skills: [],
    });

    expect(() => parseRoadmap(rawText)).toThrow(AIOutputInvalidError);
  });

  it("rejects a roadmap with circular dependencies", () => {
    const rawText = JSON.stringify({
      goal: { title: "Frontend Developer", estimatedWeeks: 20 },
      skills: [
        {
          skillKey: "html-fundamentals",
          skill: {
            title: "HTML Fundamentals",
            description: "Learn semantic HTML and document structure.",
          },
          context: {
            description: "Learn HTML structure and semantics.",
            whyImportant: "HTML is the foundation of web pages.",
            milestone: "Can build a semantic HTML page.",
            projectChallenge: "Build a semantic portfolio page.",
          },
          lesson: lesson(),
          prerequisites: ["css-basics"],
          youtubeQuery: "HTML fundamentals tutorial",
        },
        {
          skillKey: "css-basics",
          skill: {
            title: "CSS Basics",
            description: "Learn CSS styling and layout.",
          },
          context: {
            description: "Learn CSS styling and layout.",
            whyImportant: "CSS controls visual presentation.",
            milestone: "Can style a complete page.",
            projectChallenge: "Style the portfolio page.",
          },
          lesson: lesson(),
          prerequisites: ["html-fundamentals"],
          youtubeQuery: "CSS basics tutorial",
        },
      ],
    });

    expect(() => parseRoadmap(rawText)).toThrow(AIOutputInvalidError);
  });
});
