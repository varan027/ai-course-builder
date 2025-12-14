"use client";

import { useContext, useEffect, useState } from "react";
import TopicInput from "../../../components/ui/TopicInput";
import Dropdown from "../../../components/ui/Dropdown";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Textarea from "../../../components/ui/Textarea";
import type { Opt } from "../../../components/ui/Dropdown";
import { UserInputContext } from "@/app/_context/UserInputContext";


interface FormValues {
  topic: string;
  level: string;
  chapters: string;
  duration: string;
}

export default function CourseForm() {
  const LEVEL_OPTIONS: Opt[] = [
    { value: "Beginner",label: "Level" },
    { value: "Intermediate"},
    { value: "Advanced" },
  ];

  const CHAPTER_OPTIONS: Opt[] = [
    { value: "3",label: "Chapter" },
    { value: "4" },
    { value: "5" },
    { value: "6"},
  ];

  const STYLE_OPTIONS: Opt[] = [
    { value: "Quality", label: "Style" },
    { value: "Speed"},
    { value: "Balanced"},
  ];

  const DURATION_OPTIONS: Opt[] = [
    { value: "<3h",label: "Duration" },
    { value: "4h"},
    { value: "5h"},
    { value: ">6h"},
  ];

  const [topic, setTopic] = useState("");
  const [desc, setDesc] = useState("");
  const [level, setLevel] = useState("value");
  const [chapters, setChapters] = useState("");
  const [duration, setDuration] = useState("");
  const [style, setStyle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const {userInput, setUserInput} = useContext(UserInputContext)!;

  const handleTopicUpdate = ({fieldName, value}: {fieldName: string, value: string}) => {
    setUserInput((prev) => ({
      ...prev,[fieldName]: value
    }));
    setTopic(value)
  }
  const handleDescUpdate = ({fieldName, value}: {fieldName: string, value: string}) => {
    setUserInput((prev) => ({
      ...prev,[fieldName]: value
    }));
    setDesc(value)
  }
  const handleLevelUpdate = ({fieldName, value}: {fieldName: string, value: string}) => {
    setUserInput((prev) => ({
      ...prev,[fieldName]: value
    }));
    setLevel(value)
  }
  const handleStyleUpdate = ({fieldName, value}: {fieldName: string, value: string}) => {
    setUserInput((prev) => ({
      ...prev,[fieldName]: value
    }));
    setStyle(value)
  }
  const handleChapterUpdate = ({fieldName, value}: {fieldName: string, value: string}) => {
    setUserInput((prev) => ({
      ...prev,[fieldName]: value
    }));
    setChapters(value)
  }
  const handleDurationUpdate = ({fieldName, value}: {fieldName: string, value: string}) => {
    setUserInput((prev) => ({
      ...prev,[fieldName]: value
    }));
    setDuration(value)
  }

  useEffect(()=>{
    console.log("User Input Updated:", userInput);
  },[userInput])

  return (
    <div className="h-full p-4 rounded-lg shadow-sm border bg-cardbgclr border-borderclr">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <h1 className="text-center text-primary/90 font-semibold font-mono text-2xl">
          Create Course
        </h1>
        <hr className="text-borderclr" />

        <TopicInput
          id="topic"
          placeholder="Topic (e.g. React Basics)"
          value={topic}
          onChange={(e) => (
            handleTopicUpdate({fieldName: "topic", value: e.target.value}
          ))}
          className="h-12"
        />

        <Textarea
          id="description"
          placeholder="Course Description"
          value={desc}
          onChange={(e) => (
            handleDescUpdate({fieldName: "description", value: e.target.value}
          ))}
          className="h-32"
        />

        <div className="flex gap-4">
          <Dropdown
            options={LEVEL_OPTIONS}
            value={level}
            onChange={(value) => (
            handleLevelUpdate({fieldName: "level", value: value}
          ))}
            align="left"
          />

          <Dropdown
            options={STYLE_OPTIONS}
            value={style}
            onChange={(value) => (
            handleStyleUpdate({fieldName: "style", value: value}
          ))}
            align="left"
          />
        </div>

        <div className="flex gap-4 ">
          <Dropdown
            options={CHAPTER_OPTIONS}
            value={chapters}
            onChange={(value) => (
            handleChapterUpdate({fieldName: "chapters", value: value}
          ))}
            align="left"
          />

          <Dropdown
            options={DURATION_OPTIONS}
            value={duration}
            onChange={(value) => (
            handleDurationUpdate({fieldName: "duration", value: value}
          ))}
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
