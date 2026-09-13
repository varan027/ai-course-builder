export type LessonBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "code"; language: string; code: string };

export function renderLessonContent(content: string): LessonBlock[] {
  const lines = content.split("\n");
  const blocks: LessonBlock[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let listOrdered: boolean | undefined;
  let codeLines: string[] = [];
  let codeLanguage = "";
  let inCode = false;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ").trim() });
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: "list", ordered: listOrdered ?? false, items: listItems });
      listItems = [];
      listOrdered = undefined;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```") && !inCode) {
      flushParagraph();
      flushList();
      inCode = true;
      codeLanguage = trimmed.slice(3).trim();
      codeLines = [];
      continue;
    }

    if (trimmed === "```" && inCode) {
      blocks.push({ type: "code", language: codeLanguage, code: codeLines.join("\n") });
      inCode = false;
      codeLanguage = "";
      codeLines = [];
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "heading",
        level: heading[1].length as 1 | 2 | 3,
        text: heading[2].trim(),
      });
      continue;
    }

    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const isOrdered = Boolean(ordered);
      if (listOrdered !== undefined && listOrdered !== isOrdered) {
        flushList();
      }
      listOrdered = isOrdered;
      listItems.push((unordered ?? ordered)![1].trim());
      continue;
    }

    if (listItems.length > 0) {
      flushList();
    }

    paragraph.push(trimmed);
  }

  if (inCode) {
    blocks.push({ type: "code", language: codeLanguage, code: codeLines.join("\n") });
  }

  flushParagraph();
  flushList();

  return blocks;
}
