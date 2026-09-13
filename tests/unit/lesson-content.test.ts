import { describe, expect, it } from "vitest";
import { parseLessonContent } from "@/lib/lesson-content";

describe("parseLessonContent", () => {
  it("renders headings, paragraphs, lists, and code blocks as structured blocks", () => {
    const blocks = parseLessonContent(
      "## Request flow\n\nHTTP sends a request.\n\n- Method\n- Path\n\n```bash\ncurl https://example.com\n```",
    );

    expect(blocks).toEqual([
      { type: "heading", level: 2, text: "Request flow" },
      { type: "paragraph", text: "HTTP sends a request." },
      { type: "list", ordered: false, items: ["Method", "Path"] },
      { type: "code", language: "bash", code: "curl https://example.com" },
    ]);
  });

  it("keeps inline markdown in paragraph text without treating it as HTML", () => {
    const blocks = parseLessonContent(
      "Use **POST** with `application/json` when sending structured data.",
    );

    expect(blocks).toEqual([
      {
        type: "paragraph",
        text: "Use **POST** with `application/json` when sending structured data.",
      },
    ]);
  });
});
