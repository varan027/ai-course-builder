// constants/formOptions.ts

export type Opt<T = string> = {
  value: T;
  label: string;
  meta?: string;
};


export const LEVEL_OPTIONS: Opt<string>[] = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
];

export const CHAPTER_OPTIONS: Opt<number>[] = [
  { label: "3 Chapters", value: 3 },
  { label: "4 Chapters", value: 4 },
  { label: "5 Chapters", value: 5 },
  { label: "6 Chapters", value: 6 },
];

export const STYLE_OPTIONS: Opt<string>[] = [
  { label: "Quality (Detailed)", value: "Quality" },
  { label: "Speed (Concise)", value: "Speed" },
  { label: "Balanced", value: "Balanced" },
];

export const DURATION_OPTIONS: Opt<number>[] = [
  { label: "1 Hour", value: 1 },
  { label: "2 Hours", value: 2 },
  { label: "5 Hours", value: 3 },
];

