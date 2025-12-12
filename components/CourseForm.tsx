"use client";

import { useState } from "react";
import TopicInput from "./ui/TopicInput";
import Dropdown from "./ui/Dropdown";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Textarea from "./ui/Textarea";
import type { Opt } from "./ui/Dropdown";

interface FormValues {
  topic: string;
  level: string;
  chapters: string;
  duration: string;
}

interface Props {
  onGenerate: (data: FormValues) => void;
}

export default function CourseForm({ onGenerate }: Props) {
  const LEVEL_OPTIONS: Opt[] = [
    { value: "Beginner", label: "Level" },
    { value: "Intermediate", label: "Level" },
    { value: "Advanced", label: "Level" },
  ];

  const CHAPTER_OPTIONS: Opt[] = [
    { value: "3", label: "Chapters" },
    { value: "4", label: "Chapters" },
    { value: "5", label: "Chapters" },
    { value: "6", label: "Chapters" },
  ];

  const STYLE_OPTIONS: Opt[] = [
    { value: "Quality", label: "Style" },
    { value: "Speed", label: "Style" },
    { value: "Balanced", label: "Style" },
  ];

  const DURATION_OPTIONS: Opt[] = [
    { value: "<3h", label: "Duration" },
    { value: "4h", label: "Duration" },
    { value: "5h", label: "Duration" },
    { value: ">6h", label: "Duration" },
  ];

  const [topic, setTopic] = useState("");
  const [desc, setDesc] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [chapters, setChapters] = useState("4");
  const [duration, setDuration] = useState("4h");
  const [style, setStyle] = useState("Quality");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ topic, level, chapters, duration });
  };

  return (
    <Card className="h-full">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <h1 className="text-center text-primary/90 font-semibold font-mono text-2xl">
          Create Course
        </h1>
        <hr className="text-borderclr" />

        <TopicInput
          id="topic"
          placeholder="Topic (e.g. React Basics)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="h-12"
        />

        <Textarea
          id="description"
          placeholder="Course Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="h-24"
        />

        <div className="flex gap-4">
          <Dropdown
            options={LEVEL_OPTIONS}
            value={level}
            onChange={setLevel}
            align="left"
          />

          <Dropdown
            options={STYLE_OPTIONS}
            value={style}
            onChange={setStyle}
            align="left"
          />
        </div>

        <div className="flex gap-4 ">
          <Dropdown
            options={CHAPTER_OPTIONS}
            value={chapters}
            onChange={setChapters}
            align="left"
          />

          <Dropdown
            options={DURATION_OPTIONS}
            value={duration}
            onChange={setDuration}
            align="left"
          />
        </div>

        <Button
          className="w-full mt-8"
          type="submit"
          disabled={topic === "" || desc === ""}
        >
          Generate Course
        </Button>
      </form>
    </Card>
  );
}
