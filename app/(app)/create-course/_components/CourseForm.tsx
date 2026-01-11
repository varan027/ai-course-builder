"use client";
import { useContext } from "react";
import TopicInput from "../../../components/ui/TopicInput";
import Dropdown from "../../../components/ui/Dropdown";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";
import { UserInputContext } from "@/app/_context/UserInputContext";
import {
  LEVEL_OPTIONS,
  STYLE_OPTIONS,
  DURATION_OPTIONS,
  CHAPTER_OPTIONS,
} from "@/constants/formOptions";
import { CourseData } from "@/lib/types";

interface CourseFormProps {
  setCourseData: React.Dispatch<React.SetStateAction<CourseData | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CourseForm({
  setLoading,
  setCourseData,
}: CourseFormProps) {
  const { userInput, setUserInput } = useContext(UserInputContext)!;

  const handleInputChange = (field: string, value: any) => {
    setUserInput((prev) => {
      return { ...prev, [field]: value };
    });
  };

  const GenerateCourseLayout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInput),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData?.error || errorData?.message || JSON.stringify(errorData);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setCourseData(data.course);
    } catch (error) {
      console.error("Failed to generate course layout:", error);
    } finally {
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
    <div className="p-4 rounded-lg shadow-sm border bg-cardbgclr border-borderclr">
      <form
        className="space-y-4 relative lg:h-[80vh]"
        onSubmit={handleGeneration}
      >
        <h1 className="text-center text-primary/90 font-semibold font-mono text-2xl">
          Create Course
        </h1>
        <hr className="text-borderclr" />

        <TopicInput
          id="topic"
          placeholder="Topic (e.g. React Basics)"
          onChange={(e) => handleInputChange("topic", e.target.value)}
          className="h-12"
        />

        <Textarea
          id="description"
          placeholder="Course Description"
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="h-28"
        />

        <div className="flex gap-4">
          <Dropdown
            label="Level"
            options={LEVEL_OPTIONS}
            value={userInput.level}
            onChange={(value) => {
              handleInputChange("level", value);
            }}
            align="left"
          />

          <Dropdown
            label="Style"
            options={STYLE_OPTIONS}
            value={userInput.style}
            onChange={(value) => handleInputChange("style", value)}
            align="left"
          />
        </div>

        <div className="flex gap-4 ">
          <Dropdown<number>
            label="Chapter"
            options={CHAPTER_OPTIONS}
            value={userInput.chapters}
            onChange={(value) => handleInputChange("chapters", value)}
            align="left"
          />

          <Dropdown<number>
            label="Duration"
            options={DURATION_OPTIONS}
            value={userInput.duration}
            onChange={(value) => handleInputChange("duration", value)}
            align="left"
          />
        </div>

        <Button
          className="w-full lg:absolute lg:bottom-4 font-medium"
          type="submit"
          disabled={userInput.topic === ""}
        >
          Generate Course
        </Button>
      </form>
    </div>
  );
}
