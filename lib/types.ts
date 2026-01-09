interface OutlineChapter {
  index: string;
  chapterName: string;
  about: string;
  duration: string;
}

export interface CourseOutline {
  courseName: string;
  description: string;
  chapters: OutlineChapter[];
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
  chapters: OutlineChapter[];
  outline: CourseOutline;
  createdAt: string | Date;
}

export interface FormValues {
  topic: string;
  description?: string | undefined;
  level: string;
  style: string;
  chapters: number;
  duration: number;
}

