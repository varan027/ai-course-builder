import { useContext, useEffect, useState, useCallback } from "react";
import TopicInput from "../../../components/ui/TopicInput";
import Dropdown from "../../../components/ui/Dropdown";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";
import type { Opt } from "../../../components/ui/Dropdown";
import { UserInputContext } from "@/app/_context/UserInputContext";

interface CourseGenerateProps {
    OnGenerate: (e: React.FormEvent) => Promise<void>;
}

export default function CourseForm({ OnGenerate }: CourseGenerateProps) {
  const LEVEL_OPTIONS: Opt[] = [
    { value: "Beginner", label: "Level" },
    { value: "Intermediate" },
    { value: "Advanced" },
  ];

  const CHAPTER_OPTIONS: Opt[] = [
    { value: "3", label: "Chapter" },
    { value: "4" },
    { value: "5" },
    { value: "6" },
  ];

  const STYLE_OPTIONS: Opt[] = [
    { value: "Quality", label: "Style" },
    { value: "Speed" },
    { value: "Balanced" },
  ];

  const DURATION_OPTIONS: Opt[] = [
    { value: "1h", label: "Duration" },
    { value: "2h" },
    { value: "3h" },
    { value: "4h" },
  ];

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

  return (
    <div className="h-full p-4 rounded-lg shadow-sm border bg-cardbgclr border-borderclr">
      <form className="space-y-4" onSubmit={OnGenerate}>
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