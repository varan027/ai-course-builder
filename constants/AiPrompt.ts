import { FormValues } from "@/lib/types";

export function GenerateCoursePrompt(userInput: FormValues) {
  const {
    topic,
    description,
    level,
    duration,
    style,
    chapters,
  } = userInput;

  return `
Generate a complete course on the topic: "${topic}".

${description ? `Course Description: ${description}` : ""}

Audience Level: ${level}
Total Course Duration: ${duration}
Number of Chapters: ${chapters}
Teaching Style: ${style}

You MUST return the response in STRICT JSON format with this exact structure:

{
  "courseName": "Short, catchy course title",
  "description": "A concise summary of what the learner will gain",
  "chapters": [
    {
      "chapterName": "Chapter title only",
      "about": "Clear explanation of what this chapter teaches",
      "duration": "Approximate time",
    }
  ]
}

Rules:
- Do NOT include markdown
- Do NOT include code blocks
- Do NOT include explanations
- Output ONLY valid JSON
- Chapter count must exactly match ${chapters}

Return ONLY the JSON object.
`;
}

export function GenerateChapterContentPrompt(chapterName: string, courseTopic: string, style: string) {
  return `
    You are an expert instructor. Write a comprehensive reading tutorial for the chapter: "${chapterName}" 
    which is part of a course on "${courseTopic}".
    
    Teaching Style: ${style} (e.g., if 'Code', provide code examples. If 'Theory', explain concepts).

    Requirements:
    - Use Markdown formatting (headings, bold, lists, code blocks).
    - Explain the concept clearly.
    - Provide real-world examples.
    - If technical, include a small code snippet or practical step.
    - Keep it engaging and easy to read.
    - Do NOT include any intro like "Here is the content...". Start directly with the content.
  `;
}
