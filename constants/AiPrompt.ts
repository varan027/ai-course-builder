import { FormValues } from "@/lib/types";

export function GenerateCoursePrompt(userInput: FormValues) {
  const { topic, level, duration, style, chapters } = userInput;
  
  return `
    Generate a course tutorial on the topic: "${topic}".
    Level: ${level}
    Duration: ${duration}
    Style: ${style}
    Chapters: ${chapters}

    You MUST return the response in strict JSON format with the following structure:
    {
      "courseName": "Short catchy name for the course",
      "description": "A brief description of what the user will learn",
      "chapters": [
        {
          "chapterName": "Only the Name of the chapter",
          "about": "What this chapter covers",
          "duration": "approx time"
        },
        ... (generate the requested number of chapters)
      ]
    }
    
    Do not add any markdown, code blocks, or preamble. Just the raw JSON string.
  `;
}