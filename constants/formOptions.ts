// constants/formOptions.ts

export type Opt = { 
  value: string;
  label: string; // Removed '?' to force a label (better UX)
  meta?: string 
};

export const LEVEL_OPTIONS: Opt[] = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
];

export const CHAPTER_OPTIONS: Opt[] = [
  { label: "3 Chapters", value: "3" },
  { label: "4 Chapters", value: "4" },
  { label: "5 Chapters", value: "5" },
  { label: "6 Chapters", value: "6" },
];

export const STYLE_OPTIONS: Opt[] = [
  { label: "Quality (Detailed)", value: "Quality" },
  { label: "Speed (Concise)", value: "Speed" },
  { label: "Balanced", value: "Balanced" },
];

export const DURATION_OPTIONS: Opt[] = [
  { label: "1 Hour", value: "1h" },
  { label: "2 Hours", value: "2h" },
  { label: "5+ Hours", value: "5h" },
];