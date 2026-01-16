export const COURSE_OUTLINE_PROMPT = ({
  topic,
  level,
  chapters,
  duration,
}: {
  topic: string;
  level: string;
  chapters: string;
  duration: string;
}) => `
Create a structured learning course.

Topic: ${topic}
Level: ${level}

Rules:
- Output ONLY valid JSON
- EXACTLY ${chapters} chapters
- Total course duration is ${duration} minutes
- Divide the total duration reasonably across chapters
- Each chapter MUST include durationMinutes
- No markdown
- No explanations
- No extra fields

JSON format:
{
  "title": string,
  "chapters": [
    {
      "title": string,
      "about": string,
      "durationMinutes": number,
      "youtubeQuery": string
    }
  ]
}


`;
