export interface Lesson {
  id: string;
  index: number;
  title: string;
  content: string;
  videoIds: string[];
}

interface Chapter {
  index: string;
  chapterName: string;
  about: string;
  duration: string;
}

export interface CourseOutline {
  courseName: string;
  description: string;
  chapters: Chapter[];
  topic: string;
  level: string;
  duration: string;
  noOfChapters: string;
}

export interface CourseData {
  _id: string;
  name: string;
  description: string;
  outline: CourseOutline;
  createdAt: string;
}
