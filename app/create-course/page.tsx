"use client";
import { useContext, useState } from "react";
import { UserInputContext } from "../_context/UserInputContext";
import CourseForm from "./_components/CourseForm";

export default function HomePage() {
  const [loading, setLoading] = useState(false);

  const { userInput, setUserInput } = useContext(UserInputContext)!;

  const GenerateCourseLayout = async () => {
    setLoading(true);
    const DEFAULT_PROMPT =
      "Generate a Course Tutorial with Following Details containing Fields Course_Name, Description, Along with Chapter Name, About, Duration : ";
    const USER_INPUT_PROMPT =
      "Topic: " +
      userInput?.topic +
      ",Description: " +
      userInput?.description +
      ", Level: " +
      userInput?.level +
      ", Duration: " +
      userInput?.duration +
      ", No Of Chapter:" +
      userInput?.chapters +
      ",and the quality/speed/balanced:" +
      userInput?.style +
      " in JSON Format";

    const FINAL_PROMPT = DEFAULT_PROMPT + USER_INPUT_PROMPT;
    console.log(FINAL_PROMPT);
    console.log("Client-side prompt being sent:", FINAL_PROMPT);
    if (!FINAL_PROMPT) {
      console.error("Prompt string is empty or too short. Aborting fetch.");
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: FINAL_PROMPT }),
      });
      setLoading(false)

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const finalResult = data.result;
      console.log(finalResult);

    } catch (error) {
      console.error("Failed to generate course layout:", error);
    }
  };

  const handleGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await GenerateCourseLayout();
    } catch (error) {
      console.error("Generation process failed:", error);
    }
  };

  return (
    <div className="">
      <main className="lg:p-4 p-4 mt-16 md:px-24">
        <div className="lg:flex lg:space-x-4 space-y-4 max-w-">
          <div className="lg:w-80 lg">
            <CourseForm OnGenerate={handleGeneration} />
          </div>
        </div>
      </main>
    </div>
  );
}
