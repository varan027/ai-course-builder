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
}

export interface CourseData {
  _id: string;
  courseId: string;
  name: string;
  description: string;
  topic: string;
  level: string;
  duration: string;
  style: string;
  chapters: Chapter[];
  outline: CourseOutline;
  createdAt: string | Date;
}

export interface FormValues {
  topic: string;
  description: string;
  level: string;
  chapters: string;
  style: string;
  duration: string;
}