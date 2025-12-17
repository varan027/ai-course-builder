export type Opt = { 
  value: string;
  label?: string;
  meta?: string 
};

export const LEVEL_OPTIONS: Opt[] = [
  { value: "Beginner", label: "Level" },
  { value: "Intermediate" },
  { value: "Advanced" },
];

export const CHAPTER_OPTIONS: Opt[] = [
  { value: "3", label: "Chapter" },
  { value: "4" },
  { value: "5" },
  { value: "6" },
];

export const STYLE_OPTIONS: Opt[] = [
  { value: "Quality", label: "Style" },
  { value: "Speed" },
  { value: "Balanced" },
];

export const DURATION_OPTIONS: Opt[] = [
  { value: "1h", label: "Duration" },
  { value: "2h" },
  { value: "3h" },
  { value: "4h" },
];
