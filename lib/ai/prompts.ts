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
- Each chapter represents about ${duration} minutes of learning
- No markdown
- No explanations
- No extra fields
- "about" should briefly explain what the learner will gain

JSON format:
{
  "title": string,
  "chapters": [
    {
      "title": string,
      "about": string,
      "youtubeQuery": string
    }
  ]
}

`;
