"use client"
import { useContext, useState, useCallback } from "react";
import TopicInput from "../../../components/ui/TopicInput";
import Dropdown from "../../../components/ui/Dropdown";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";
import { UserInputContext } from "@/app/_context/UserInputContext";
import { LEVEL_OPTIONS, STYLE_OPTIONS, DURATION_OPTIONS, CHAPTER_OPTIONS } from "@/constants/formOptions";
import { CourseData } from "@/lib/types";
import { GenerateCoursePrompt } from "@/constants/AiPrompt";

interface CourseFormProps {
  setCourseData: React.Dispatch<React.SetStateAction<CourseData | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CourseForm({setLoading, setCourseData}: CourseFormProps) {
  const { userInput, setUserInput } = useContext(UserInputContext)!;

  const [userForm, setUserForm]= useState({
    topic: "",
    description: "",
    level:"Beginner",
    duration: "1h",
    style: "Quality",
    chapters: "3",
  })

  const handleInputChange = (field: string, value: any) =>{
    console.log("parent recieved", field, value)
    setUserForm((prev)=> {
      return {...prev, [field]: value}
    })
  }

  const GenerateCourseLayout = async () => {
    setLoading(true);
    const FINAL_PROMPT = GenerateCoursePrompt(userInput)

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

    console.log("current state : ", userInput)

  return (
    <div className="p-4 rounded-lg shadow-sm border bg-cardbgclr border-borderclr">
      <form className="space-y-4 relative lg:h-[80vh]" onSubmit={handleGeneration}>
        <h1 className="text-center text-primary/90 font-semibold font-mono text-2xl">
          Create Course
        </h1>
        <hr className="text-borderclr" />

        <TopicInput
          id="topic"
          placeholder="Topic (e.g. React Basics)"
          onChange={(e) =>
            handleInputChange("topic", e.target.value)
          }
          className="h-12"
        />

        <Textarea
          id="description"
          placeholder="Course Description"
          onChange={(e) =>
            handleInputChange("description", e.target.value)
          }
          className="h-32"
        />

        <div className="flex gap-4">
          <Dropdown
            label="Level"
            options={LEVEL_OPTIONS}
            value={userForm.level}
            onChange={(value) =>{
              console.log(userInput.level)
              handleInputChange("level", value)
            } 
            }
            align="left"
          />

          <Dropdown
            label="Style"
            options={STYLE_OPTIONS}
            value={userForm.style}
            onChange={(value) =>
            handleInputChange("style", value)
          }
            align="left"
          />
        </div>

        <div className="flex gap-4 ">
          <Dropdown
            label="Chapter"
            options={CHAPTER_OPTIONS}
            value={userForm.chapters}
            onChange={(value) =>
            handleInputChange("chapters", value)
          }
            align="left"
          />

          <Dropdown
            label="Duration"
            options={DURATION_OPTIONS}
            value={userForm.duration}
            onChange={(value) =>
            handleInputChange("duration", value)
          }
            align="left"
          />
        </div>

        <Button
          className="w-full lg:absolute lg:bottom-4"
          type="submit"
          disabled={userInput.topic === ""}
        >
          Generate Course
        </Button>
      </form>
    </div>
  );
}