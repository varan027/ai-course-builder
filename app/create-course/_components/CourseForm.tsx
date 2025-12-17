"use client"
import { useContext, useState, useCallback } from "react";
import TopicInput from "../../../components/ui/TopicInput";
import Dropdown from "../../../components/ui/Dropdown";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";
import { UserInputContext } from "@/app/_context/UserInputContext";
import { LEVEL_OPTIONS, STYLE_OPTIONS, DURATION_OPTIONS, CHAPTER_OPTIONS } from "@/constants/formOptions";
import { CourseData } from "@/lib/types";

interface CourseFormProps {
  setCourseData: React.Dispatch<React.SetStateAction<CourseData | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CourseForm({setLoading, setCourseData}: CourseFormProps) {

  const [topic, setTopic] = useState("");
  const [desc, setDesc] = useState("");
  const [level, setLevel] = useState("");
  const [chapters, setChapters] = useState("");
  const [duration, setDuration] = useState("");
  const [style, setStyle] = useState("");

  const { userInput, setUserInput } = useContext(UserInputContext)!;

  const stateSetters: Record<string, React.Dispatch<React.SetStateAction<string>>> = {
    topic: setTopic,
    description: setDesc, 
    level: setLevel,
    style: setStyle,
    chapters: setChapters,
    duration: setDuration,
  };

  const handleUpdate = useCallback(
    ({ fieldName, value }: { fieldName: string; value: string }) => {
      setUserInput((prev) => ({
        ...prev,
        [fieldName]: value,
      }));

      const setter = stateSetters[fieldName];
      if (setter) {
        setter(value);
      } else {
        console.warn(`No setter found for fieldName: ${fieldName}`);
      }
    },
    [setUserInput, stateSetters]
  );

  const handleTopicUpdate = (props: { fieldName: string; value: string }) => handleUpdate(props);
  const handleDescUpdate = (props: { fieldName: string; value: string }) => handleUpdate(props);
  const handleLevelUpdate = (props: { fieldName: string; value: string }) => handleUpdate(props);
  const handleStyleUpdate = (props: { fieldName: string; value: string }) => handleUpdate(props);
  const handleChapterUpdate = (props: { fieldName: string; value: string }) => handleUpdate(props);
  const handleDurationUpdate = (props: { fieldName: string; value: string }) => handleUpdate(props);

  const GenerateCourseLayout = async () => {
    setLoading(true);
    const DEFAULT_PROMPT =
      "Generate a Course Tutorial on Following Details as Fields Course_Name, Description, Along with Chapter Name, About, Duration : ";
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
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: FINAL_PROMPT }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      const data = await response.json();
      const finalResult = data.result;
      setCourseData(finalResult)
      
    } catch (error) {
      console.error("Failed to generate course layout:", error);
    } finally{
      setLoading(false);
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
    <div className="h-full p-4 rounded-lg shadow-sm border bg-cardbgclr border-borderclr">
      <form className="space-y-4" onSubmit={handleGeneration}>
        <h1 className="text-center text-primary/90 font-semibold font-mono text-2xl">
          Create Course
        </h1>
        <hr className="text-borderclr" />

        <TopicInput
          id="topic"
          placeholder="Topic (e.g. React Basics)"
          value={topic}
          onChange={(e) =>
            handleTopicUpdate({ fieldName: "topic", value: e.target.value })
          }
          className="h-12"
        />

        <Textarea
          id="description"
          placeholder="Course Description"
          value={desc}
          onChange={(e) =>
            handleDescUpdate({
              fieldName: "description",
              value: e.target.value,
            })
          }
          className="h-32"
        />

        <div className="flex gap-4">
          <Dropdown
            options={LEVEL_OPTIONS}
            value={level}
            onChange={(value) =>
              handleLevelUpdate({ fieldName: "level", value: value })
            }
            align="left"
          />

          <Dropdown
            options={STYLE_OPTIONS}
            value={style}
            onChange={(value) =>
              handleStyleUpdate({ fieldName: "style", value: value })
            }
            align="left"
          />
        </div>

        <div className="flex gap-4 ">
          <Dropdown
            options={CHAPTER_OPTIONS}
            value={chapters}
            onChange={(value) =>
              handleChapterUpdate({ fieldName: "chapters", value: value })
            }
            align="left"
          />

          <Dropdown
            options={DURATION_OPTIONS}
            value={duration}
            onChange={(value) =>
              handleDurationUpdate({ fieldName: "duration", value: value })
            }
            align="left"
          />
        </div>

        <Button
          className="w-full mt-8"
          type="submit"
          disabled={topic === ""}
        >
          Generate Course
        </Button>
      </form>
    </div>
  );
}