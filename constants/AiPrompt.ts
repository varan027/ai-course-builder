export const GenerateCoursePrompt = (input: any) => {
  return `
    Generate a course tutorial JSON.
    Strict JSON only. No markdown. No code blocks.

    INPUT:
    Topic: ${input?.topic}
    Desc: ${input?.description}
    Level: ${input?.level}
    Duration: ${input?.duration}
    Chapters: ${input?.chapters}
    Style: ${input?.style}

    OUTPUT FORMAT:
    {
      "Course_Name": "Short, catchy title (max 5 words)",
      "Description": "Brief course summary",
      "Chapters": [
        {
          "Chapter_Name": "Chapter Title",
          "About": "Content summary",
          "Duration": "Time (e.g., 15m)"
        }
      ]
    }
    Return the response as a valid JSON object only. Do not wrap it in markdown code blocks.
  `;
};