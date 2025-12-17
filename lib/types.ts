export interface Lesson {
  id: string;
  index: number;
  title: string;
  content: string;
  videoIds: string[];
}

interface Chapter {
  index: string;
  Chapter_Name: string;
  About: string;
  Duration: string;
}

export interface ChaptersOutline {
  Course_Name: string;
  Description: string;
  Chapters: Chapter[];
  topic: string;
  Level: string;
  Duration: string;
  No_Of_Chapters: string;
}

export interface Course {
  _id: string;
  name: string;
  description: string;
  outline: ChaptersOutline;
  createdAt: string;
}
