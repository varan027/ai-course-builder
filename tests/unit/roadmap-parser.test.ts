import { describe, expect, it } from "vitest";
import { parseRoadmap } from "@/lib/ai/parser";
import { AIOutputInvalidError } from "@/lib/errors/domain";

describe("parseRoadmap", () => {
  it("accepts a valid roadmap", () => {
    const rawText = JSON.stringify({
      goal: {
        title: "Frontend Developer",
        estimatedWeeks: 20,
      },
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
          prerequisites: [],
          youtubeQuery: "HTML fundamentals tutorial",
        },
      ],
    });

    const result = parseRoadmap(rawText);

    expect(result.goal.title).toBe("Frontend Developer");
    expect(result.skills).toHaveLength(1);
    expect(result.skills[0].skillKey).toBe("html-fundamentals");
  });

  it("rejects invalid JSON", () => {
    expect(() => parseRoadmap("this is not JSON")).toThrow(
      AIOutputInvalidError,
    );
  });

  it("rejects a roadmap that violates the schema", () => {
    const rawText = JSON.stringify({
      goal: {
        title: "Frontend Developer",
        estimatedWeeks: 20,
      },
      skills: [],
    });

    expect(() => parseRoadmap(rawText)).toThrow(AIOutputInvalidError);
  });

  it("rejects a roadmap with circular dependencies", () => {
    const rawText = JSON.stringify({
      goal: {
        title: "Frontend Developer",
        estimatedWeeks: 20,
      },
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
          prerequisites: ["html-fundamentals"],
          youtubeQuery: "CSS basics tutorial",
        },
      ],
    });

    expect(() => parseRoadmap(rawText)).toThrow(AIOutputInvalidError);
  });
});
