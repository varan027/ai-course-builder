export interface Lesson {
  id: string;
  index: number;
  title: string;
  content: string;
  videoIds: string[];
}

export interface Chapter {
  id: string;
  index: number;
  title: string;
  objective: string;
  est_time_mins: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
}
