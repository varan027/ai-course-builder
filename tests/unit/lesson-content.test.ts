import { describe, expect, it } from "vitest";
import { renderLessonContent } from "@/lib/lesson-content";

describe("renderLessonContent", () => {
  it("parses headings, paragraphs, lists, inline code, and fenced code blocks", () => {
    const markdown = [
      "## Request lifecycle",
      "",
      "A request moves from the client to the server.",
      "",
      "- Request method",
      "- Headers",
      "- Response body",
      "",
      "Use `fetch()` to make the request.",
      "",
      "```ts",
      "const response = await fetch('/api/health');",
      "```",
    ].join("\\n");

    expect(renderLessonContent(markdown)).toEqual([
      { type: "heading", level: 2, text: "Request lifecycle" },
      { type: "paragraph", text: "A request moves from the client to the server." },
      {
        type: "list",
        ordered: false,
        items: ["Request method", "Headers", "Response body"],
      },
      { type: "paragraph", text: "Use `fetch()` to make the request." },
      { type: "code", language: "ts", code: "const response = await fetch('/api/health');" },
    ]);
  });

  it("supports ordered lists", () => {
    expect(renderLessonContent("1. First\\n2. Second")).toEqual([
      { type: "list", ordered: true, items: ["First", "Second"] },
    ]);
  });
});
