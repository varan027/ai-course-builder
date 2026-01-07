import { FormValues } from "@/lib/types";

export function GenerateCoursePrompt(userInput: FormValues) {
  const {
    topic,
    description,
    level,
    duration,
    style,
    chapters,
    includeVideos,
  } = userInput;

  return `
Generate a complete course on the topic: "${topic}".

${description ? `Course Description: ${description}` : ""}

Audience Level: ${level}
Total Course Duration: ${duration} minutes
Number of Chapters: ${chapters}
Teaching Style: ${style}

${includeVideos
  ? "Include 1–2 relevant YouTube video titles per chapter."
  : "Do NOT include any video recommendations."}

You MUST return the response in STRICT JSON format with this exact structure:

{
  "courseName": "Short, catchy course title",
  "description": "A concise summary of what the learner will gain",
  "chapters": [
    {
      "chapterName": "Chapter title only",
      "about": "Clear explanation of what this chapter teaches",
      "duration": "Approximate time in minutes (e.g. 20 minutes)",
      ${
        includeVideos
          ? `"videos": ["Video title 1", "Video title 2"]`
          : ""
      }
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
